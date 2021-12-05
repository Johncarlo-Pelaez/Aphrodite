import { Document, DocumentStatus, DocumentHistory } from 'src/entities';
import {
  EntityManager,
  EntityRepository,
  ILike,
  In,
  FindOperator,
} from 'typeorm';
import {
  CreateDocumentParam,
  CountParam,
  GetDocumentsParam,
  BeginDocProcessParam,
  QrDocumentParam,
  FailDocProcessParam,
  DoneIndexingParam,
  MigrateDocumentParam,
  FailDocMigrateParam,
  FailIndexingParam,
  EncodeQrBarcodeParam,
  EncodeAccountDetailsParam,
  FailEncodeParam,
  CheckerApproveDocParam,
  CheckerDispproveDocParam,
  ApproverApproveDisapproveDocParam,
  UpdateForRetryParam,
  UpdateToCancelledParam,
} from './document.params';

@EntityRepository()
export class DocumentRepository {
  constructor(private readonly manager: EntityManager) {}

  async getDocuments(param: GetDocumentsParam): Promise<Document[]> {
    const { search = '', documentType, statuses } = param;

    let whereDocumentType: { documentType: FindOperator<string> };
    let whereStatusIn: { status: FindOperator<DocumentStatus> };

    if (documentType && documentType !== '') {
      whereDocumentType = {
        documentType: ILike(`%${documentType}%`),
      };
    }

    if (statuses && !!statuses.length) {
      whereStatusIn = {
        status: In(statuses),
      };
    }

    return await this.manager.find(Document, {
      relations: ['user'],
      where: [
        {
          documentName: ILike(`%${search}%`),
          ...whereDocumentType,
          ...whereStatusIn,
        },
        {
          user: {
            firstName: ILike(`%${search}%`),
          },
          ...whereDocumentType,
          ...whereStatusIn,
        },
        {
          user: {
            lastName: ILike(`%${search}%`),
          },
          ...whereDocumentType,
          ...whereStatusIn,
        },
      ],
      order: { modifiedDate: 'DESC' },
      skip: param.skip,
      take: param.take,
    });
  }

  async findDocumentsByIds(documentIds: number[]): Promise<Document[]> {
    return await this.manager.find(Document, {
      relations: ['user'],
      where: [
        {
          id: In(documentIds),
        },
      ],
    });
  }

  async getDocument(id: number): Promise<Document> {
    return await this.manager.findOne(Document, {
      relations: ['user'],
      where: { id },
    });
  }

  async getDocumentByQRCode(qrCode: string): Promise<Document> {
    return await this.manager.findOne(Document, {
      where: { qrCode },
    });
  }

  async count(param: CountParam): Promise<number> {
    const { search = '', documentType, statuses } = param;

    let whereDocumentType: { documentType: FindOperator<string> };
    let whereStatusIn: { status: FindOperator<DocumentStatus> };

    if (documentType && documentType !== '') {
      whereDocumentType = {
        documentType: ILike(`%${documentType}%`),
      };
    }

    if (statuses && !!statuses.length) {
      whereStatusIn = {
        status: In(statuses),
      };
    }

    return await this.manager.count(Document, {
      relations: ['user'],
      where: [
        {
          documentName: ILike(`%${search}%`),
          ...whereDocumentType,
          ...whereStatusIn,
        },
        {
          user: {
            firstName: ILike(`%${search}%`),
          },
          ...whereDocumentType,
          ...whereStatusIn,
        },
        {
          user: {
            lastName: ILike(`%${search}%`),
          },
          ...whereDocumentType,
          ...whereStatusIn,
        },
      ],
    });
  }

  async getHistory(documentId: number): Promise<DocumentHistory[]> {
    return await this.manager.find(DocumentHistory, {
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
    history.userUsername = document.userUsername;
    history.documentStatus = document.status;
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
        document.modifiedBy = param.username;
        document.status = DocumentStatus.UPLOADED;
        document.qrCode = param.qrCode;
        document.qrAt = param.createdDate;
        document.userUsername = param.username;
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

  async qrDocument(param: QrDocumentParam): Promise<void> {
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
      document.contractDetails = param.contractDetails;
      document.contractDetailsReqParams = param.contractDetailsReqParams;
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
      document.status = DocumentStatus.CHECKING;
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
      document.status = DocumentStatus.ENCODING;
      document.modifiedDate = param.processAt;
      document.description = 'For manual encode.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async encodeQrBarcode(param: EncodeQrBarcodeParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await transaction.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.ENCODING_DONE;
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

  async encodeAccountDetails(param: EncodeAccountDetailsParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.ENCODING_DONE;
      document.encodeValues = param.encodeValues;
      document.encodedAt = param.encodedAt;
      document.encoder = param.encodedBy;
      document.modifiedDate = param.encodedAt;
      document.modifiedBy = param.encodedBy;
      document.description = 'Successfully encoded.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async failEncode(param: FailEncodeParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.ENCODING_FAILED;
      document.contractDetailsReqParams = param.contractDetailsReqParams;
      document.encodeValues = param.encodeValues;
      document.modifiedDate = param.failedAt;
      document.description =
        'Failed to retrieve account details from sales force.';
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
      document.status = DocumentStatus.CHECKING_APPROVED;
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
      document.status = DocumentStatus.CHECKING_DISAPPROVED;
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

  async updateForRetry(param: UpdateForRetryParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.RETRYING;
      document.modifiedDate = param.processAt;
      document.modifiedBy = param.retriedBy;
      document.description = 'Retrying process.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }

  async updateToCancelled(param: UpdateToCancelledParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.status = DocumentStatus.CANCELLED;
      document.modifiedDate = param.processAt;
      document.modifiedBy = param.cancelledBy;
      document.description = 'Cancelled.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document);
      await transaction.save(history);
    });
  }
}
