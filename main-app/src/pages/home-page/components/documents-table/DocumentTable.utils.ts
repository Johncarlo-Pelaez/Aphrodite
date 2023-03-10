import { DocumentStatus } from 'core/enum';

export const generateOperationText = (status: DocumentStatus): string => {
    const arrStatus = status.split('_');
    if(!!arrStatus?.length) {
      const operation = arrStatus[0];
      switch(operation) {
        case 'INDEXING':
          return 'Information Request';
        case 'ENCODING':
          return 'Manual Encoding';
        case 'CHECKING':
        case 'APPROVED':
        case 'DISAPPROVED':
          return 'Quality Checking';
        case 'MIGRATE':
          return 'Document Import';
        case 'UPLOADED':
          return 'Upload Document';
        case 'QR':
          return 'QR code/ Barcode Scanning';
        default:
          return '';
      }
  }
  else return '';
};

export const generateStatusText = (status: DocumentStatus): string => {
  const arrStatus = status.split('_');
  if (arrStatus.length === 2) {
    const status = arrStatus[1];
    switch (status) {
      case 'BEGIN':
        return 'Processing';
      case 'FAILED':
        return 'Error';
      case 'DONE':
        return 'Success';
      default:
        return 'Waiting';
    }
  } else {
    const status = arrStatus[0];
    switch (status) {
      case DocumentStatus.UPLOADED:
        return 'Success';
      case DocumentStatus.CANCELLED:
        return 'Cancelled';
      case DocumentStatus.RETRYING:
        return 'Retrying';
      case DocumentStatus.DISAPPROVED:
        return 'Disapproved';
      default:
        return 'Waiting';
    }
  }
};
