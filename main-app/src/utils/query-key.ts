import { UseDocuments, UseDocumentsProcessCount } from 'hooks';

export class QueryKey {
  public static readonly currentUser = 'currentUser';
  public static readonly users = 'users';
  private static readonly documents = 'documents';
  public static readonly documentHistory = 'documenHistory';
  public static readonly paginatedDocuments = 'paginatedDocuments';
  public static readonly nomenclaturesWhitelist = 'nomenclaturesWhitelist';
  public static readonly nomenclaturesLookups = 'nomenclaturesLookups';
  public static readonly activityLogs = 'activityLogs';

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
}
