import { UseDocuments } from 'hooks';

export class QueryKey {
  public static readonly users = 'users';
  private static readonly documents = 'documents';
  public static readonly paginatedDocuments = 'paginatedDocuments';

  public static buildPaginatedDocuments(data: UseDocuments) {
    return [this.paginatedDocuments, data];
  }

  public static buildDocument(id?: number) {
    return [this.documents, id];
  }
}
