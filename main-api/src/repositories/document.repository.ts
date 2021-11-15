import { Document, DocumentStatus, DocumentHistory } from 'src/entities';
import { EntityManager, EntityRepository, ILike } from 'typeorm';
import {
  CreateDocumentParam,
  GetDocumentsParam,
  BeginDocProcessParam,
  QrDocumentParams,
  FailDocProcessParam,
  DoneIndexingParam,
  MigrateDocumentParam,
  FailDocMigrateParam,
  FailIndexingParam,
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
      order: { createdDate: 'DESC', id: 'DESC' },
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

  async beginQrDocument(param: BeginDocProcessParam): Promise<void> {
    const description = 'Begin QR Code.';
    await this.manager.transaction(async (transaction): Promise<void> => {
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
    });
  }

  async qrDocument(param: QrDocumentParams): Promise<void> {
    const description = 'Successfully done QR Code.';
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await transaction.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.QR_DONE;
      document.qrCode = param.qrCode;
      document.qrAt = param.qrAt;
      document.modifiedDate = param.qrAt;
      document.modifiedBy = param.modifiedBy ?? document.modifiedBy;
      document.description = description;
      await transaction.save(document);

      const history = new DocumentHistory();
      history.description = document.description;
      history.documentSize = document.documentSize;
      history.createdDate = document.modifiedDate;
      history.userId = document.userId;
      history.documentId = document.id;
      await transaction.save(history);
    });
  }

  async failQrDocument(param: FailDocProcessParam): Promise<void> {
    const description = 'Failed QR Code.';
    await this.manager.transaction(async (transaction): Promise<void> => {
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
    });
  }

  async beginIndexing(param: BeginDocProcessParam): Promise<void> {
    const description = 'Begin indexing.';
    await this.manager.transaction(async (transaction): Promise<void> => {
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
    });
  }

  async doneIndexing(param: DoneIndexingParam): Promise<void> {
    const description =
      'Successfully retrieved account details from sales force.';
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.INDEXING_DONE;
      document.documentType = param.documentType;
      document.contractDetails = param.contractDetails;
      document.docTypeReqParams = param.docTypeReqParams;
      document.contractDetailsReqParams = param.contractDetailsReqParams;
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
    });
  }

  async failIndexing(param: FailIndexingParam): Promise<void> {
    const description = 'Failed to retrieve account details from sales force.';
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.INDEXING_FAILED;
      document.documentType = param.documentType;
      document.contractDetails = param.contractDetails;
      document.docTypeReqParams = param.docTypeReqParams;
      document.contractDetailsReqParams = param.contractDetailsReqParams;
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
    });
  }

  async beginMigrate(param: BeginDocProcessParam): Promise<void> {
    const description = 'Begin migrate.';
    await this.manager.transaction(async (transaction): Promise<void> => {
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
    });
  }

  async migrateDocument(param: MigrateDocumentParam): Promise<void> {
    const description = 'Successfully migrated.';
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.MIGRATE_DONE;
      document.modifiedDate = param.migratedAt;
      document.springReqParams = param.springReqParams;
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
    });
  }

  async failMigrate(param: FailDocMigrateParam): Promise<void> {
    const description = 'Migration failed.';
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.MIGRATE_FAILED;
      document.modifiedDate = param.failedAt;
      document.springReqParams = param.springReqParams;
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
    });
  }

  async updateForChecking(param: BeginDocProcessParam): Promise<void> {
    const description = 'For quality checking..';
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.FOR_CHECKING;
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
    });
  }

  async updateForManualEncode(param: BeginDocProcessParam): Promise<void> {
    const description = 'For manual encode..';
    return await this.manager.transaction(
      async (transaction): Promise<void> => {
        const document = await this.manager.findOneOrFail(
          Document,
          param.documentId,
        );
        document.status = DocumentStatus.FOR_MANUAL_ENCODE;
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
      },
    );
  }
}
