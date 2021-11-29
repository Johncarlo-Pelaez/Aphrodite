export interface CreateNomenclatureWhitelistParam {
  description: string;
}

export interface UpdateNomenclatureWhitelistParam
  extends CreateNomenclatureWhitelistParam {
  id: number;
}
