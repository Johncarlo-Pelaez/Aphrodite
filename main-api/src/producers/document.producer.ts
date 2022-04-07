import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { DOCUMENT_QUEUE, MIGRATE_JOB } from 'src/consumers';
import { Document } from 'src/entities';
import { P1, P2, P3, P4 } from 'src/core';

@Injectable()
export class DocumentProducer {
  constructor(
    @InjectQueue(DOCUMENT_QUEUE)
    private readonly documentQueue: Queue<number>,
  ) {}

  async migrate({ id, documentSize }: Document): Promise<Job<number>> {
    let priority: number;
    const docSizeInMB = documentSize / (1024 * 1024);
    const onePointFiveMB = 1572864 / (1024 * 1024);

    if (docSizeInMB < 0.5) priority = P1;
    if (docSizeInMB >= 0.5 && docSizeInMB <= 1) priority = P2;
    if (docSizeInMB > 1 && docSizeInMB <= onePointFiveMB) priority = P3;
    if (docSizeInMB > onePointFiveMB) priority = P4;

    const AFTER_30_SECONDS = 1000 * 30;
    const job = await this.documentQueue.add(MIGRATE_JOB, id, {
      attempts: 1,
      backoff: AFTER_30_SECONDS,
      removeOnComplete: true,
      removeOnFail: true,
      jobId: id,
      priority,
    });
    return job;
  }

  async cancel(documentId: number): Promise<void> {
    const job = await this.documentQueue.getJob(documentId);
    if (job) job.remove();
  }
}
