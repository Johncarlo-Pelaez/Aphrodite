import { DocumentStatus } from 'core/enum';
import { OperationOption } from './components/operation-dropdown';
import { StatusOption } from './components/status-dropdown';

export const concatDocumentStatuses = (
  operation: OperationOption | undefined,
  status: StatusOption | undefined,
): string => {
  const documentStatus = `${operation}_${status}, `;
  let strDocumentStatuses = '';
  if (operation === OperationOption.QR) {
    switch (status) {
      case StatusOption.WAITING:
        strDocumentStatuses += `${DocumentStatus.UPLOADED}, `;
        break;
      default:
        strDocumentStatuses += documentStatus;
        break;
    }
  } else if (operation === OperationOption.ENCODING) {
    switch (status) {
      case StatusOption.WAITING:
        strDocumentStatuses += `${DocumentStatus.ENCODING}, `;
        break;
      default:
        strDocumentStatuses += documentStatus;
        break;
    }
  } else if (operation === OperationOption.INDEXING) {
    switch (status) {
      case StatusOption.WAITING:
        strDocumentStatuses += `${DocumentStatus.QR_DONE}, ${DocumentStatus.ENCODING_DONE}, `;
        break;
      default:
        strDocumentStatuses += documentStatus;
        break;
    }
  } else if (operation === OperationOption.CHECKING) {
    switch (status) {
      case StatusOption.WAITING:
        strDocumentStatuses += `${DocumentStatus.CHECKING}, ${DocumentStatus.CHECKING_DISAPPROVED}, `;
        break;
      case StatusOption.DONE:
        strDocumentStatuses += `${DocumentStatus.CHECKING_APPROVED}, ${DocumentStatus.APPROVED}, `;
        break;
      case StatusOption.FAILED:
        strDocumentStatuses += `${DocumentStatus.CHECKING_FAILED}, `;
        break;
      case StatusOption.DISAPPROVED:
        strDocumentStatuses += `${DocumentStatus.DISAPPROVED}, `;
        break;
      // default:
      //   strDocumentStatuses += `${DocumentStatus.CHECKING_DISAPPROVED}, `;
      //   break;
    }
  } else if (operation === OperationOption.MIGRATE) {
    switch (status) {
      case StatusOption.WAITING:
        strDocumentStatuses += `${DocumentStatus.INDEXING_DONE}, ${DocumentStatus.CHECKING_APPROVED}, ${DocumentStatus.APPROVED}, `;
        break;
      default:
        strDocumentStatuses += documentStatus;
        break;
    }
  }
  return strDocumentStatuses;
};

export const getForRetryDocStatuses = (): DocumentStatus[] =>
  Object.values(DocumentStatus).filter(
    (s) => s.includes('FAILED') || s.includes('CANCELLED'),
  );

export const getForCancelDocStatuses = (): DocumentStatus[] =>
  Object.values(DocumentStatus).filter(
    (s) =>
      !s.includes(DocumentStatus.MIGRATE_DONE) &&
      !s.includes('FAILED') &&
      !s.includes('CANCELLED'),
  );

export const getForDeleteDocsFileStatuses = (): DocumentStatus[] =>
  Object.values(DocumentStatus).filter(
    (s) => s.includes('FAILED') || s.includes('CANCELLED'),
  );

export const getDocStatusFilter = (
  cmbStatusValue: StatusOption | undefined,
  cmbOperationValue: OperationOption | undefined,
): DocumentStatus[] => {
  const allOperation = Object.values(OperationOption).filter(
    (o) => o !== OperationOption.ALL,
  );
  const allStatus = Object.values(StatusOption).filter(
    (s) => s !== StatusOption.ALL,
  );
  let strStatusesFilter = '';

  if (
    cmbOperationValue === OperationOption.ALL &&
    cmbStatusValue === StatusOption.ALL
  ) {
    strStatusesFilter = Object.values(DocumentStatus).join(',');
  } else if (
    cmbOperationValue === OperationOption.ALL &&
    cmbStatusValue !== StatusOption.ALL
  ) {
    for (const operation of allOperation) {
      strStatusesFilter += concatDocumentStatuses(operation, cmbStatusValue);
    }
  } else if (
    cmbOperationValue !== OperationOption.ALL &&
    cmbStatusValue === StatusOption.ALL
  ) {
    for (const status of allStatus) {
      strStatusesFilter += concatDocumentStatuses(cmbOperationValue, status);
    }
  } else {
    strStatusesFilter = concatDocumentStatuses(
      cmbOperationValue,
      cmbStatusValue,
    );
  }

  const statusesFilter = strStatusesFilter
    .split(',')
    .filter((value, index, self) => self.indexOf(value) === index)
    .filter((value) => value !== ' ')
    .map((status) => status.trim()) as DocumentStatus[];

  return !!statusesFilter.length ? statusesFilter : [];
};
