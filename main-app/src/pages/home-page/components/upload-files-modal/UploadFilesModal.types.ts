import { CancelTokenSource } from 'apis';

export interface UploadModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export enum UploadStatus {
  SUCCESS,
  FAILED,
  PENDING,
  REMOVED,
  CANCELED,
  UPLOADING,
}

export interface FileInfo {
  file: File;
  percent: number;
  status: UploadStatus;
  cancelToken?: CancelTokenSource;
}
