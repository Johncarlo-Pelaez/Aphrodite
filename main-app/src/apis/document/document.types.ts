import { Document } from 'models';

export type GetDocsResult = {
  count: number;
  data: Document[];
};

export type UploadDocResult = {
  id: number;
};

export type UploadDocParams = {
  formData: FormData;
  onUploadProgress: (percentCompleted: number) => void;
};
