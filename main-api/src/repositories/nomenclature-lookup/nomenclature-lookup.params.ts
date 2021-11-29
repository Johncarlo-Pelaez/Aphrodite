export interface CreateNomenclatureLookupParam {
  nomenclature: string;
  documentGroup: string;
}

export interface UpdateNomenclatureLookupParam
  extends CreateNomenclatureLookupParam {
  id: number;
}
