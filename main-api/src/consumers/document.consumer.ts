import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { DocumentRepository } from 'src/repositories';

@Processor('document')
export class DocumentConsumer {
  constructor(private readonly documentRepository: DocumentRepository) {}

  @Process('migrate')
  async migrate(job: Job<number>): Promise<void> {
    const document = await this.documentRepository.getDocument(job.data);
    console.log(document);
  }
}
