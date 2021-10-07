import { Document } from 'src/entities';
import { EntityManager, EntityRepository } from 'typeorm';

@EntityRepository()
export class DocumentRepository {
  constructor(private readonly manager: EntityManager) {}

  async getDocument(id: number): Promise<Document> {
    return this.manager.findOne(Document, {
      relations: ['user'],
      where: { id },
    });
  }
}
