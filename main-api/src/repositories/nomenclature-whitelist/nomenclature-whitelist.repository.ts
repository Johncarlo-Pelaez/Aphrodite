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
    const nomenClature = new NomenclatureWhitelist();
    nomenClature.description = description;
    await this.manager.save(nomenClature);
    return nomenClature.id;
  }

  async updateNomenclatureWhitelist({
    id,
    description,
  }: UpdateNomenclatureWhitelistParam): Promise<void> {
    const nomenClature = await this.manager.findOneOrFail(
      NomenclatureWhitelist,
      id,
    );
    nomenClature.description = description;
    await this.manager.save(nomenClature);
  }

  async deleteNomenclatureWhitelist(id: number): Promise<void> {
    await this.manager.delete(NomenclatureWhitelist, id);
  }
}
