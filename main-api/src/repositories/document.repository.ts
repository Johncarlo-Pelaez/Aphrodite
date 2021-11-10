import { Document, DocumentStatus, DocumentHistory } from 'src/entities';
import { EntityManager, EntityRepository, ILike } from 'typeorm';
import {
  CreateDocumentParam,
  GetDocumentsParam,
  BeginDocProcessParam,
  QrDocumentParams,
  FailDocProcessParam,
  IndexedDocumentParam,
  DocumentMigrateParam,
  FailDocMigrateParam,
} from './document.params';

@EntityRepository()
export class DocumentRepository {
  constructor(private readonly manager: EntityManager) {}

  async getDocuments(param: GetDocumentsParam): Promise<Document[]> {
    const search = param.search || '';

    return this.manager.find(Document, {
      relations: ['user'],
      where: [
        {
          documentName: ILike(`%${search}%`),
        },
        {
          user: {
            firstName: ILike(`%${search}%`),
          },
        },
        {
          user: {
            lastName: ILike(`%${search}%`),
          },
        },
      ],
      order: { modifiedDate: 'DESC' },
      skip: param.skip,
      take: param.take,
    });
  }

  async getDocument(id: number): Promise<Document> {
    return this.manager.findOne(Document, {
      relations: ['user'],
      where: { id },
    });
  }

  async count(search?: string): Promise<number> {
    return this.manager.count(Document, {
      relations: ['user'],
      where: [
        {
          documentName: ILike(`%${search}%`),
        },
        {
          user: {
            firstName: ILike(`%${search}%`),
          },
        },
        {
          user: {
            lastName: ILike(`%${search}%`),
          },
        },
      ],
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
        document.mimeType = param.mimeType;
        document.description = description;
        document.modifiedDate = param.createdDate;
        document.modifiedBy = param.userId;
        document.status = DocumentStatus.UPLOADED;
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

  async beginQrDocument(param: BeginDocProcessParam): Promise<Document> {
    const description = 'Begin QR Code.';
    return await this.manager.transaction(
      async (transaction): Promise<Document> => {
        const document = await this.manager.findOneOrFail(
          Document,
          param.documentId,
        );
        document.status = DocumentStatus.QR_BEGIN;
        document.modifiedDate = param.beginAt;
        document.description = description;
        await this.manager.save(document);

        const history = new DocumentHistory();
        history.description = document.description;
        history.documentSize = document.documentSize;
        history.createdDate = document.modifiedDate;
        history.userId = document.userId;
        history.documentId = document.id;
        await transaction.save(history);

        return document;
      },
    );
  }

  async qrDocument(param: QrDocumentParams): Promise<Document> {
    const description = 'Successfully done QR Code.';
    return await this.manager.transaction(
      async (transaction): Promise<Document> => {
        const document = await transaction.findOneOrFail(
          Document,
          param.documentId,
        );
        document.status = DocumentStatus.QR_DONE;
        document.qrCode = param.qrCode;
        document.qrAt = param.qrAt;
        document.modifiedDate = param.qrAt;
        document.description = description;
        await transaction.save(document);

        const history = new DocumentHistory();
        history.description = document.description;
        history.documentSize = document.documentSize;
        history.createdDate = document.modifiedDate;
        history.userId = document.userId;
        history.documentId = document.id;
        await transaction.save(history);

        return document;
      },
    );
  }

  async failQrDocument(param: FailDocProcessParam): Promise<Document> {
    const description = 'Failed QR Code.';
    return await this.manager.transaction(
      async (transaction): Promise<Document> => {
        const document = await this.manager.findOneOrFail(
          Document,
          param.documentId,
        );
        document.status = DocumentStatus.QR_FAILED;
        document.modifiedDate = param.failedAt;
        document.description = description;
        await transaction.save(document);

        const history = new DocumentHistory();
        history.description = document.description;
        history.documentSize = document.documentSize;
        history.createdDate = document.modifiedDate;
        history.userId = document.userId;
        history.documentId = document.id;
        await transaction.save(history);

        return document;
      },
    );
  }

  async beginIndexing(param: BeginDocProcessParam): Promise<Document> {
    const description = 'Begin indexing.';
    return await this.manager.transaction(
      async (transaction): Promise<Document> => {
        const document = await this.manager.findOneOrFail(
          Document,
          param.documentId,
        );
        document.status = DocumentStatus.INDEXING_BEGIN;
        document.modifiedDate = param.beginAt;
        document.description = description;
        await transaction.save(document);

        const history = new DocumentHistory();
        history.description = document.description;
        history.documentSize = document.documentSize;
        history.createdDate = document.modifiedDate;
        history.userId = document.userId;
        history.documentId = document.id;
        await transaction.save(history);

        return document;
      },
    );
  }

  async indexedDocument(param: IndexedDocumentParam): Promise<Document> {
    const description =
      'Successfully retrieved account details from sales force.';
    return await this.manager.transaction(
      async (transaction): Promise<Document> => {
        const document = await this.manager.findOneOrFail(
          Document,
          param.documentId,
        );
        document.status = DocumentStatus.INDEXING_DONE;
        document.documentType = param.documentType;
        document.contractDetails = param.contractDetails;
        document.modifiedDate = param.indexedAt;
        document.description = description;
        await transaction.save(document);

        const history = new DocumentHistory();
        history.description = document.description;
        history.documentSize = document.documentSize;
        history.createdDate = document.modifiedDate;
        history.userId = document.userId;
        history.documentId = document.id;
        await transaction.save(history);

        return document;
      },
    );
  }

  async failIndexing(param: FailDocProcessParam): Promise<Document> {
    const description = 'Failed to retrieve account details from sales force.';
    return await this.manager.transaction(
      async (transaction): Promise<Document> => {
        const document = await this.manager.findOneOrFail(
          Document,
          param.documentId,
        );
        document.status = DocumentStatus.INDEXING_FAILED;
        document.modifiedDate = param.failedAt;
        document.description = description;
        await transaction.save(document);

        const history = new DocumentHistory();
        history.description = document.description;
        history.documentSize = document.documentSize;
        history.createdDate = document.modifiedDate;
        history.userId = document.userId;
        history.documentId = document.id;
        await transaction.save(history);

        return document;
      },
    );
  }

  async beginMigrate(param: BeginDocProcessParam): Promise<Document> {
    const description = 'Begin migrate.';
    return await this.manager.transaction(
      async (transaction): Promise<Document> => {
        const document = await this.manager.findOneOrFail(
          Document,
          param.documentId,
        );
        document.status = DocumentStatus.MIGRATE_BEGIN;
        document.modifiedDate = param.beginAt;
        document.description = description;
        await transaction.save(document);

        const history = new DocumentHistory();
        history.description = document.description;
        history.documentSize = document.documentSize;
        history.createdDate = document.modifiedDate;
        history.userId = document.userId;
        history.documentId = document.id;
        await transaction.save(history);

        return document;
      },
    );
  }

  async documentMigrate(param: DocumentMigrateParam): Promise<Document> {
    const description = 'Successfully migrated.';
    return await this.manager.transaction(
      async (transaction): Promise<Document> => {
        const document = await this.manager.findOneOrFail(
          Document,
          param.documentId,
        );
        document.status = DocumentStatus.MIGRATE_DONE;
        document.modifiedDate = param.migratedAt;
        document.springResponse = param.springResponse;
        document.description = description;
        await transaction.save(document);

        const history = new DocumentHistory();
        history.description = document.description;
        history.documentSize = document.documentSize;
        history.createdDate = document.modifiedDate;
        history.userId = document.userId;
        history.documentId = document.id;
        await transaction.save(history);

        return document;
      },
    );
  }

  async failMigrate(param: FailDocMigrateParam): Promise<Document> {
    const description = 'Migration failed.';
    return await this.manager.transaction(
      async (transaction): Promise<Document> => {
        const document = await this.manager.findOneOrFail(
          Document,
          param.documentId,
        );
        document.status = DocumentStatus.MIGRATE_FAILED;
        document.modifiedDate = param.failedAt;
        document.springResponse = param.springResponse;
        document.description = description;
        await transaction.save(document);

        const history = new DocumentHistory();
        history.description = document.description;
        history.documentSize = document.documentSize;
        history.createdDate = document.modifiedDate;
        history.userId = document.userId;
        history.documentId = document.id;
        await transaction.save(history);

        return document;
      },
    );
  }
}
