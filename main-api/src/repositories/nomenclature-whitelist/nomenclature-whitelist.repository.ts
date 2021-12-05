import { NomenclatureWhitelist } from 'src/entities';
import { EntityManager, EntityRepository, ILike } from 'typeorm';
import {
  CreateNomenclatureWhitelistParam,
  UpdateNomenclatureWhitelistParam,
} from './nomenclature-whitelist.params';

@EntityRepository()
export class NomenclatureWhitelistRepository {
  constructor(private readonly manager: EntityManager) {}

  async getWhitelistNomenclatures(): Promise<NomenclatureWhitelist[]> {
    return await this.manager.find(NomenclatureWhitelist, {
      order: { description: 'ASC' },
    });
  }

  async getNomenclatureWhitelist(id: number): Promise<NomenclatureWhitelist> {
    return await this.manager.findOne(NomenclatureWhitelist, id);
  }

  async checkNomenclatureWhitelistIfExist(
    description: string,
  ): Promise<boolean> {
    return !!(await this.manager.findOne(NomenclatureWhitelist, {
      where: { description: ILike(`%${description}%`) },
    }));
  }

  async createNomenclatureWhitelist({
    description,
  }: CreateNomenclatureWhitelistParam): Promise<number> {
    const nomenclatureWhitelist = new NomenclatureWhitelist();
    nomenclatureWhitelist.description = description;
    await this.manager.save(nomenclatureWhitelist);
    return nomenclatureWhitelist.id;
  }

  async updateNomenclatureWhitelist({
    id,
    description,
  }: UpdateNomenclatureWhitelistParam): Promise<void> {
    const nomenclatureWhitelist = await this.manager.findOneOrFail(
      NomenclatureWhitelist,
      id,
    );
    nomenclatureWhitelist.description = description;
    await this.manager.save(nomenclatureWhitelist);
  }

  async deleteNomenclatureWhitelist(id: number): Promise<void> {
    await this.manager.delete(NomenclatureWhitelist, id);
  }
}
