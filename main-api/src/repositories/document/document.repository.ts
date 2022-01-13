import * as moment from 'moment';
import * as fileSize from 'filesize';
import { Document, DocumentStatus, DocumentHistory } from 'src/entities';
import {
  EntityManager,
  EntityRepository,
  ILike,
  In,
  Between,
  FindOperator,
  Not,
} from 'typeorm';
import {
  CreateDocumentParam,
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
  CheckerApproveDocParam,
  CheckerDispproveDocParam,
  ApproverApproveDisapproveDocParam,
  UpdateForRetryParam,
  UpdateToCancelledParam,
  DeleteFileParam,
  ReplaceFileParam,
} from './document.params';

@EntityRepository()
export class DocumentRepository {
  constructor(private readonly manager: EntityManager) {}

  async getDocuments(param: GetDocumentsParam): Promise<Document[]> {
    const { search = '', documentType, statuses, username, from, to } = param;
    let whereDocumentType: { documentType: FindOperator<string> };
    let whereStatusIn: { status: FindOperator<DocumentStatus> };
    let whereUsername: { username: string };
    let whereModifiedDate: { modifiedDate: FindOperator<Date> };

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

    if (username && username !== '') {
      whereUsername = {
        username: username,
      };
    }

    if (from) {
      const dateTo = moment(!!to ? to : from)
        .add(1, 'day')
        .add(-1, 'millisecond')
        .toDate();

      whereModifiedDate = {
        modifiedDate: Between(from, dateTo),
      };
    }

    return await this.manager.find(Document, {
      relations: ['user', 'documentHistories'],
      where: [
        {
          documentName: ILike(`%${search}%`),
          ...whereDocumentType,
          ...whereStatusIn,
          user: {
            ...whereUsername,
          },
          ...whereModifiedDate,
        },
        {
          documentType: ILike(`%${search}%`),
          ...whereDocumentType,
          ...whereStatusIn,
          user: {
            ...whereUsername,
          },
          ...whereModifiedDate,
        },
        {
          user: {
            firstName: ILike(`%${search}%`),
            ...whereUsername,
          },
          ...whereDocumentType,
          ...whereStatusIn,
          ...whereModifiedDate,
        },
        {
          user: {
            lastName: ILike(`%${search}%`),
            ...whereUsername,
          },
          ...whereDocumentType,
          ...whereStatusIn,
          ...whereModifiedDate,
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
      relations: ['user', 'documentHistories'],
      where: { id },
    });
  }

  async getDocumentByQRCode(
    qrCode: string,
    exceptDocId?: number,
  ): Promise<Document> {
    if (exceptDocId) {
      return await this.manager.findOne(Document, {
        where: { qrCode, id: Not(exceptDocId) },
      });
    }

    return await this.manager.findOne(Document, {
      where: { qrCode },
    });
  }

  async count(param: GetDocumentsParam): Promise<number> {
    const { search = '', documentType, statuses, username } = param;
    let whereDocumentType: { documentType: FindOperator<string> };
    let whereStatusIn: { status: FindOperator<DocumentStatus> };
    let whereUsername: { username: string };
    let whereModifiedDate: { modifiedDate: FindOperator<Date> };

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

    if (username && username !== '') {
      whereUsername = {
        username: username,
      };
    }

    return await this.manager.count(Document, {
      relations: ['user'],
      where: [
        {
          documentName: ILike(`%${search}%`),
          ...whereDocumentType,
          ...whereStatusIn,
          user: {
            ...whereUsername,
          },
          ...whereModifiedDate,
        },
        {
          user: {
            firstName: ILike(`%${search}%`),
            ...whereUsername,
          },
          ...whereDocumentType,
          ...whereStatusIn,
          ...whereModifiedDate,
        },
        {
          user: {
            lastName: ILike(`%${search}%`),
            ...whereUsername,
          },
          ...whereDocumentType,
          ...whereStatusIn,
          ...whereModifiedDate,
        },
      ],
    });
  }

  async getHistory(documentId: number): Promise<DocumentHistory[]> {
    return await this.manager.find(DocumentHistory, {
      relations: ['document'],
      where: { documentId },
      order: { createdDate: 'DESC', id: 'DESC' },
    });
  }

  genarateDocumentHistory(
    document: Document,
    customValue?: {
      [key in keyof DocumentHistory]?: any;
    },
  ): DocumentHistory {
    let history = new DocumentHistory();
    history.filename = document.documentName;
    history.description = document.description;
    history.documentSize = document.documentSize;
    history.mimeType = document.mimeType;
    history.pageTotal = document.pageTotal;
    history.createdDate = document.modifiedDate;
    history.documentStatus = customValue?.documentStatus ?? document.status;
    history.userUsername = customValue?.userUsername ?? 'RIS';
    history.documentId = document.id;
    history.note = customValue?.note;
    history.document = document;
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
        document.pageTotal = param.pageTotal;
        await transaction.save(document);

        const history = this.genarateDocumentHistory(document, {
          userUsername: document.modifiedBy,
          note: `Filename: ${document.documentName}, Size: ${fileSize(
            document.documentSize,
          )}, Total page: ${document.pageTotal}, Type: ${document.mimeType}`,
        });
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

      const history = this.genarateDocumentHistory(document, {
        note: param.qrCode,
      });
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

      const history = this.genarateDocumentHistory(document, {
        note: param.errorMessage,
      });
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

      const history = this.genarateDocumentHistory(document, {
        note: param.documentType ?? param.contractDetails,
        userUsername: document.encoder,
      });
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

      const history = this.genarateDocumentHistory(document, {
        note: param.salesforceResponse ?? param.errorMessage,
      });
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
      document.springcmReqParams = param.springcmReqParams;
      document.springResponse = param.springcmResponse;
      document.description = 'Successfully migrated.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document, {
        note: param.springcmResponse,
        userUsername: document.approver ?? document.checker,
      });
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
      document.springcmReqParams = param.springcmReqParams;
      document.springResponse = param.springcmResponse;
      document.description = 'Migration failed.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document, {
        note: param.springcmResponse ?? param.errorMessage,
      });
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

      const history = this.genarateDocumentHistory(document, {
        userUsername: document.encoder,
        note: param.qrBarCode,
      });
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

      const history = this.genarateDocumentHistory(document, {
        userUsername: document.encoder,
        note: param.encodeValues,
      });
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

      const history = this.genarateDocumentHistory(document, {
        userUsername: document.checker,
      });
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

      const history = this.genarateDocumentHistory(document, {
        userUsername: document.checker,
        note: param.remarks,
      });
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

      const history = this.genarateDocumentHistory(document, {
        userUsername: document.approver,
      });
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

      const history = this.genarateDocumentHistory(document, {
        userUsername: document.approver,
      });
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

      const history = this.genarateDocumentHistory(document, {
        userUsername: document.modifiedBy,
      });
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

      const history = this.genarateDocumentHistory(document, {
        userUsername: document.modifiedBy,
      });
      await transaction.save(history);
    });
  }

  async deleteFile(param: DeleteFileParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.modifiedDate = param.deletedAt;
      document.modifiedBy = param.deletedBy ?? document.modifiedBy;
      document.isFileDeleted = true;
      document.description = 'Delete file from system directory.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document, {
        documentStatus: '',
        userUsername: param.deletedBy,
        note: `Filename: ${document.documentName}, Size: ${fileSize(
          document.documentSize,
        )}, Total page: ${document.pageTotal}, Type: ${document.mimeType}`,
      });
      await transaction.save(history);
    });
  }

  async replaceFile(param: ReplaceFileParam): Promise<void> {
    await this.manager.transaction(async (transaction): Promise<void> => {
      const document = await this.manager.findOneOrFail(
        Document,
        param.documentId,
      );
      document.documentName = param.documentName;
      document.documentSize = param.documentSize;
      document.mimeType = param.mimeType;
      document.pageTotal = param.pageTotal;
      document.qrCode = param.qrCode;
      document.qrAt = param.replacedAt;
      document.documentType = null;
      document.contractDetails = null;
      document.encodeValues = null;
      document.modifiedDate = param.replacedAt;
      document.modifiedBy = param.replacedBy;
      document.isFileDeleted = false;
      document.description = 'Replace file from system directory.';
      await transaction.save(document);

      const history = this.genarateDocumentHistory(document, {
        documentStatus: '',
        userUsername: param.replacedBy,
        note: `Filename: ${document.documentName}, Size: ${fileSize(
          document.documentSize,
        )}, Total page: ${document.pageTotal}, Type: ${document.mimeType}`,
      });
      await transaction.save(history);
    });
  }
}
