export interface UploadModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export enum UploadStatus {
  SUCCESS,
  FAILED,
  PENDING,
  REMOVED,
}

export interface FileInfo {
  file: File;
  percent: number;
  status: UploadStatus;
}