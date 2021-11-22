import { Document, DocumentStatus, DocumentHistory } from 'src/entities';
import { EntityManager, EntityRepository, ILike, In } from 'typeorm';
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
  EncodeQrBarcodeParams,
  EncodeAccountDetailsParams,
  CheckerApproveDocParam,
  CheckerDispproveDocParam,
  ApproverApproveDisapproveDocParam,
  UpdateForRetry,
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

  async findDocumentsByIds(documentIds: number[]): Promise<Document[]> {
    return this.manager.find(Document, {
      relations: ['user'],
      where: [
        {
          id: In(documentIds),
        },
      ],
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

  genarateDocumentHistory(document: Document): DocumentHistory {
    const history = new DocumentHistory();
    history.description = document.description;
    history.documentSize = document.documentSize;
    history.createdDate = document.modifiedDate;
    history.userId = document.userId;
    history.documentId = document.id;
    return history;
  }

  async createDocument(param: CreateDocumentParam): Promise<number> {
    const documentId = await this.manager.transaction(
      async (transaction): Promise<number> => {
        const document = new Document();
        document.uuid = param.uuid;
        document.documentName = param.documentName;
        document.documentSize = param.documentSize;
        document.mimeType = param.mimeType;
        document.description = 'Successfully uploaded.';
        document.modifiedDate = param.createdDate;
        document.modifiedBy = param.userId;
        document.status = DocumentStatus.UPLOADED;
        document.userId = param.userId;
        await transaction.save(document);

        const history = this.genarateDocumentHistory(document);
        await transaction.save(history);

        return document.id;
      },
    );

    return documentId;
  }

  async beginQrDocument(param: BeginDocProcessParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.QR_BEGIN;
      document.modifiedDate = param.processAt;
      document.description = 'Begin QR Code.';
      await this.manager.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async qrDocument(param: QrDocumentParams): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await transaction.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.QR_DONE;
      document.qrCode = param.qrCode;
      document.qrAt = param.qrAt;
      document.modifiedDate = param.qrAt;
      document.description = 'Successfully done QR Code.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async failQrDocument(param: FailDocProcessParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.QR_FAILED;
      document.modifiedDate = param.failedAt;
      document.description = 'Failed QR Code.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async beginIndexing(param: BeginDocProcessParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.INDEXING_BEGIN;
      document.modifiedDate = param.processAt;
      document.description = 'Begin indexing.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async doneIndexing(param: DoneIndexingParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.INDEXING_DONE;
      document.documentType = param.documentType;
      document.docTypeReqParams = param.docTypeReqParams;
      document.modifiedDate = param.indexedAt;
      document.description =
        'Successfully retrieved account details from sales force.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async failIndexing(param: FailIndexingParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.INDEXING_FAILED;
      document.docTypeReqParams = param.docTypeReqParams;
      document.contractDetailsReqParams = param.contractDetailsReqParams;
      document.modifiedDate = param.failedAt;
      document.description =
        'Failed to retrieve account details from sales force.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async beginMigrate(param: BeginDocProcessParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.MIGRATE_BEGIN;
      document.modifiedDate = param.processAt;
      document.description = 'Begin migrate.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async migrateDocument(param: MigrateDocumentParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.MIGRATE_DONE;
      document.modifiedDate = param.migratedAt;
      document.springReqParams = param.springReqParams;
      document.springResponse = param.springResponse;
      document.description = 'Successfully migrated.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async failMigrate(param: FailDocMigrateParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.MIGRATE_FAILED;
      document.modifiedDate = param.failedAt;
      document.springReqParams = param.springReqParams;
      document.springResponse = param.springResponse;
      document.description = 'Migration failed.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async updateForChecking(param: BeginDocProcessParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.FOR_CHECKING;
      document.modifiedDate = param.processAt;
      document.description = 'For quality checking.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async updateForManualEncode(param: BeginDocProcessParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.FOR_MANUAL_ENCODE;
      document.modifiedDate = param.processAt;
      document.description = 'For manual encode.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async encodeQrBarcode(param: EncodeQrBarcodeParams): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await transaction.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.ENCODED;
      document.qrCode = param.qrBarCode;
      document.qrAt = param.encodedAt;
      document.encodedAt = param.encodedAt;
      document.encoder = param.encodedBy;
      document.modifiedDate = param.encodedAt;
      document.modifiedBy = param.encodedBy;
      document.description = 'Qr or Barcode has successfully encoded.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async encodeAccountDetails(param: EncodeAccountDetailsParams): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.ENCODED;
      document.documentType = param.documentType;
      document.contractDetails = param.contractDetails;
      document.contractDetailsReqParams = param.contractDetailsReqParams;
      document.encodedAt = param.encodedAt;
      document.encoder = param.encodedBy;
      document.modifiedDate = param.encodedAt;
      document.modifiedBy = param.encodedBy;
      document.description = 'Account details has successfully encoded.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async checkerApproveDoc(param: CheckerApproveDocParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.APPROVED;
      document.description = 'Checker approved.';
      document.documentDate = param.documentDate;
      document.checkedAt = param.checkedAt;
      document.checker = param.checkedBy;
      document.modifiedDate = param.checkedAt;
      document.modifiedBy = param.checkedBy;
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async checkerDisapproveDoc(param: CheckerDispproveDocParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.FOR_APPROVAL;
      document.description = 'Checker Disapproved.';
      document.documentDate = param.documentDate;
      document.remarks = param.remarks;
      document.checkedAt = param.checkedAt;
      document.checker = param.checkedBy;
      document.modifiedDate = param.checkedAt;
      document.modifiedBy = param.checkedBy;
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async approverApproveDoc(
    param: ApproverApproveDisapproveDocParam,
  ): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.APPROVED;
      document.description = 'Approver approved.';
      document.approver = param.approver;
      document.modifiedDate = param.modifiedAt;
      document.modifiedBy = param.approver;
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async approverDispproveDoc(
    param: ApproverApproveDisapproveDocParam,
  ): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.DISAPPROVED;
      document.description = 'Approver disapproved.';
      document.approver = param.approver;
      document.modifiedDate = param.modifiedAt;
      document.modifiedBy = param.approver;
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async updateForRetry(param: UpdateForRetry): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.FOR_RETRY;
      document.modifiedDate = param.processAt;
      document.modifiedBy = param.retryBy;
      document.description = 'Retry process.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }
}
