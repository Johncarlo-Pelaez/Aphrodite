import { UseDocuments, UseDocumentsProcessCount } from 'hooks';
import {
  UseActivityLog,
  UseDocumentReport,
  UseInfoRequest,
  UseDocumentReportQC,
  UseReportApproval,
  UseReportImport,
  UseReportRIS,
} from 'apis';

export class QueryKey {
  public static readonly currentUser = 'currentUser';
  public static readonly users = 'users';
  private static readonly documents = 'documents';
  public static readonly documentHistory = 'documenHistory';
  public static readonly paginatedDocuments = 'paginatedDocuments';
  public static readonly nomenclaturesWhitelist = 'nomenclaturesWhitelist';
  public static readonly nomenclaturesLookups = 'nomenclaturesLookups';
  public static readonly activityLogs = 'activityLogs';
  public static readonly paginatedActivityLogs = 'paginatedActivityLogs';
  public static readonly paginatedDocumentReportUploaded =
    'paginatedDocumentReportUploaded';
  public static readonly paginatedReportInfoRequest =
    'paginatedReportInfoRequest';
  public static readonly paginatedDocumentReportQualityChecked =
    'paginatedDocumentReportQualityChecked';

  public static readonly paginatedReportApproval = 'paginatedReportApproval';
  public static readonly paginatedReportImport = 'paginatedReportImport';
  public static readonly paginatedReportRIS = 'paginatedReportRIS';

  public static buildPaginatedActivityLogs(data: UseActivityLog) {
    return [this.paginatedActivityLogs, data];
  }

  public static buildPaginatedDocuments(data: UseDocuments) {
    return [this.paginatedDocuments, data];
  }

  public static buildDocument(id?: number) {
    return [this.documents, id];
  }

  public static buildDocumentHistory(id?: number) {
    return [this.documentHistory, id];
  }

  public static buildDocumentProcessCount(data: UseDocumentsProcessCount) {
    return [this.documents, data];
  }

  public static buildPaginatedDocumentReportUploaded(data: UseDocumentReport) {
    return [this.paginatedDocumentReportUploaded, data];
  }

  public static builPaginatedReportInformationRequest(data: UseInfoRequest) {
    return [this.paginatedReportInfoRequest, data];
  }

  public static buildPaginatedReportQualityChecked(data: UseDocumentReportQC) {
    return [this.paginatedDocumentReportQualityChecked, data];
  }

  public static buildPaginatedReportApproval(data: UseReportApproval) {
    return [this.paginatedReportApproval, data];
  }

  public static buildPaginatedReportImport(data: UseReportImport) {
    return [this.paginatedReportImport, data];
  }

  public static buildPaginatedReportRIS(data: UseReportRIS) {
    return [this.paginatedReportRIS, data];
  }
}
