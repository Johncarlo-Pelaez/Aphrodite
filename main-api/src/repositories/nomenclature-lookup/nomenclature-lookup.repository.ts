import { NomenclatureLookup } from 'src/entities';
import { EntityManager, EntityRepository } from 'typeorm';
import {
  CreateNomenclatureLookupParam,
  UpdateNomenclatureLookupParam,
} from './nomenclature-lookup.params';

@EntityRepository()
export class NomenclatureLookupRepository {
  constructor(private readonly manager: EntityManager) {}

  async getNomenclatureLookups(): Promise<NomenclatureLookup[]> {
    return await this.manager.find(NomenclatureLookup, {
      order: { nomenclature: 'ASC' },
    });
  }

  async createNomenclatureLookup(
    params: CreateNomenclatureLookupParam,
  ): Promise<number> {
    const nomenclatureLookup = new NomenclatureLookup();
    nomenclatureLookup.nomenclature = params.nomenclature;
    nomenclatureLookup.documentGroup = params.documentGroup;
    await this.manager.save(nomenclatureLookup);
    return nomenclatureLookup.id;
  }

  async updateNomenclatureLookup(
    params: UpdateNomenclatureLookupParam,
  ): Promise<void> {
    const nomenclatureLookup = await this.manager.findOneOrFail(
      NomenclatureLookup,
      params.id,
    );
    nomenclatureLookup.nomenclature = params.nomenclature;
    nomenclatureLookup.documentGroup = params.documentGroup;
    await this.manager.save(nomenclatureLookup);
  }

  async deleteNomenclatureLookup(id: number): Promise<void> {
    await this.manager.delete(NomenclatureLookup, id);
  }
}
