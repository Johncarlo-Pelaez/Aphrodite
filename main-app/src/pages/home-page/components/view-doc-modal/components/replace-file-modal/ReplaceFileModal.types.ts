import { CancelTokenSource } from 'apis';

export interface UploadModalProps {
  documentId: number;
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

export interface ReplaceFileInfo {
  file: File;
  percent: number;
  status: UploadStatus;
  error?: string;
  cancelToken?: CancelTokenSource;
}
