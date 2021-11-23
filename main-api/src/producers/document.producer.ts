import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { DOCUMENT_QUEUE, MIGRATE_JOB } from 'src/consumers';

@Injectable()
export class DocumentProducer {
  constructor(
    @InjectQueue(DOCUMENT_QUEUE)
    private readonly documentQueue: Queue<number>,
  ) {}

  async migrate(documentId: number): Promise<Job<number>> {
    const AFTER_30_SECONDS = 1000 * 30;
    const job = await this.documentQueue.add(MIGRATE_JOB, documentId, {
      attempts: 3,
      backoff: AFTER_30_SECONDS,
      removeOnComplete: true,
      removeOnFail: true,
    });
    return job;
  }
}
