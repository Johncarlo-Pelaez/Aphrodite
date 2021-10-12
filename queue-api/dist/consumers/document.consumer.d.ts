import { Job } from 'bull';
import { DocumentRepository } from 'src/repositories';
export declare class DocumentConsumer {
    private readonly documentRepository;
    constructor(documentRepository: DocumentRepository);
    migrate(job: Job<number>): Promise<void>;
}
