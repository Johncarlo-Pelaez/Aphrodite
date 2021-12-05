import { DocumentStatus } from 'core/enum';
import { OperationOption } from './components/operation-dropdown';
import { StatusOption } from './components/status-dropdown';

export const concatDocumentStatuses = (
  operation: OperationOption,
  status: StatusOption,
): string => {
  const documentStatus = `${operation}_${status}, `;
  let strDocumentStatuses = '';
  if (operation === OperationOption.ENCODING) {
    switch (status) {
      case StatusOption.WAITING:
      case StatusOption.BEGIN:
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
      case StatusOption.BEGIN:
        strDocumentStatuses += `${DocumentStatus.CHECKING}, `;
        break;
      case StatusOption.DONE:
        strDocumentStatuses += `${DocumentStatus.CHECKING_APPROVED}, ${DocumentStatus.CHECKING_DISAPPROVED}, `;
        break;
      default:
        strDocumentStatuses += documentStatus;
        break;
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

export const getForRetryDocstatuses = (): DocumentStatus[] =>
  Object.values(DocumentStatus).filter((s) => {
    const arrStattmp = s.split('_');
    if (arrStattmp.length === 2) return arrStattmp[1] === 'FAILED';
    else return arrStattmp[0] === DocumentStatus.CANCELLED;
  });

export const getForCancelDocStatuses = (): DocumentStatus[] =>
  Object.values(DocumentStatus).filter((s) => {
    const arrStattmp = s.split('_');
    if (arrStattmp.length === 2)
      return arrStattmp[1] !== 'DONE' && arrStattmp[1] !== 'FAILED';
    else return arrStattmp[0] !== DocumentStatus.CANCELLED;
  });
