import { DocumentStatus } from 'core/enum';

export const concatDocumentStatuses = (
  operation: string,
  status: string,
): string => {
  const documentStatus = `${operation}_${status}, `;
  let strDocumentStatuses = '';
  if (operation === 'ENCODING') {
    switch (status) {
      case 'WAITING':
      case 'BEGIN':
        strDocumentStatuses += `${operation}, `;
        break;
      default:
        strDocumentStatuses += documentStatus;
        break;
    }
  } else if (operation === 'INDEXING') {
    switch (status) {
      case 'WAITING':
        strDocumentStatuses += 'QR_DONE, ENCODING_DONE, ';
        break;
      default:
        strDocumentStatuses += documentStatus;
        break;
    }
  } else if (operation === 'CHECKING') {
    switch (status) {
      case 'WAITING':
      case 'BEGIN':
        strDocumentStatuses += `${operation}, `;
        break;
      case 'DONE':
        strDocumentStatuses += 'CHECKING_APPROVED, CHECKING_DISAPPROVED, ';
        break;
      default:
        strDocumentStatuses += documentStatus;
        break;
    }
  } else if (operation === 'MIGRATE') {
    switch (status) {
      case 'WAITING':
        strDocumentStatuses += 'INDEXING_DONE, CHECKING_APPROVED, APPROVED, ';
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
    else return arrStattmp[0] === 'CANCELLED';
  });

export const getForCancelDocStatuses = (): DocumentStatus[] =>
  Object.values(DocumentStatus).filter((s) => {
    const arrStattmp = s.split('_');
    if (arrStattmp.length === 2)
      return arrStattmp[1] !== 'DONE' && arrStattmp[1] !== 'FAILED';
    else return arrStattmp[0] !== 'CANCELLED';
  });
