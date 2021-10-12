import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';

@Injectable()
export class DocumentProducer {
  constructor(
    @InjectQueue('document') private readonly documentQueue: Queue<number>,
  ) {}

  async migrate(documentId: number): Promise<Job<number>> {
    const AFTER_30_SECONDS = 1000 * 30;
    const job = await this.documentQueue.add('migrate', documentId, {
      attempts: 3,
      backoff: AFTER_30_SECONDS,
      removeOnComplete: true,
      removeOnFail: true,
    });
    return job;
  }
}
