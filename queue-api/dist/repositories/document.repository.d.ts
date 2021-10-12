import { Document } from 'src/entities';
import { EntityManager } from 'typeorm';
export declare class DocumentRepository {
    private readonly manager;
    constructor(manager: EntityManager);
    getDocument(id: number): Promise<Document>;
}
