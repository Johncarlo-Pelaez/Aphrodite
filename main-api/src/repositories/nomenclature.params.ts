export interface CreateNomenClatureParam {
  description: string;
}

export interface UpdateNomenClatureParam extends CreateNomenClatureParam {
  id: number;
}
