export enum DocumentStatus {
  UPLOADED = 'UPLOADED',
  QR_BEGIN = 'QR_BEGIN',
  QR_FAILED = 'QR_FAILED',
  QR_DONE = 'QR_DONE',
  INDEXING_BEGIN = 'INDEXING_BEGIN',
  INDEXING_FAILED = 'INDEXING_FAILED',
  INDEXING_DONE = 'INDEXING_DONE',
  ENCODING = 'ENCODING',
  ENCODING_FAILED = 'ENCODING_FAILED',
  ENCODING_DONE = 'ENCODING_DONE',
  CHECKING = 'CHECKING',
  CHECKING_FAILED = 'CHECKING_FAILED',
  CHECKING_APPROVED = 'CHECKING_APPROVED',
  CHECKING_DISAPPROVED = 'CHECKING_DISAPPROVED',
  APPROVED = 'APPROVED',
  DISAPPROVED = 'DISAPPROVED',
  MIGRATE_BEGIN = 'MIGRATE_BEGIN',
  MIGRATE_FAILED = 'MIGRATE_FAILED',
  MIGRATE_DONE = 'MIGRATE_DONE',
  MIGRATE_CANCELLED = 'MIGRATE_CANCELLED',
  RETRYING = 'RETRYING',
}
