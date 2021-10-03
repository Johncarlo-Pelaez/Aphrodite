import { Document, DocumentHistory } from 'src/entities';
import { EntityManager, EntityRepository } from 'typeorm';
import { CreateDocumentParam } from './document.params';

@EntityRepository()
export class DocumentRepository {
  constructor(private readonly manager: EntityManager) {}

  async getDocuments(): Promise<Document[]> {
    return this.manager.find(Document, {
      relations: ['user'],
    });
  }

  async getDocument(id: number): Promise<Document> {
    return this.manager.findOne(Document, {
      relations: ['user'],
      where: { id },
    });
  }

  async getHistory(documentId: number): Promise<DocumentHistory[]> {
    return this.manager.find(DocumentHistory, {
      relations: ['document', 'user'],
      where: { documentId },
      order: { createdDate: 'DESC' },
    });
  }

  async createDocument(param: CreateDocumentParam): Promise<number> {
    const description = 'Successfully uploaded.';

    const documentId = await this.manager.transaction(
      async (transaction): Promise<number> => {
        const document = new Document();
        document.uuid = param.uuid;
        document.documentName = param.documentName;
        document.documentSize = param.documentSize;
        document.description = description;
        document.modifiedDate = param.createdDate;
        document.userId = param.userId;
        await transaction.save(document);

        const history = new DocumentHistory();
        history.description = document.description;
        history.documentSize = document.documentSize;
        history.createdDate = document.modifiedDate;
        history.userId = document.userId;
        history.documentId = document.id;
        await transaction.save(history);

        return document.id;
      },
    );

    return documentId;
  }
}
