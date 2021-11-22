import { Nomenclature } from 'src/entities';
import { EntityManager, EntityRepository, ILike } from 'typeorm';
import {
  CreateNomenClatureParam,
  UpdateNomenClatureParam,
} from './nomenclature.params';

@EntityRepository()
export class NomenclatureRepository {
  constructor(private readonly manager: EntityManager) {}

  async getNomenclatures(): Promise<Nomenclature[]> {
    return await this.manager.find(Nomenclature, {
      order: { description: 'ASC' },
    });
  }

  async getNomenclature(id: number): Promise<Nomenclature> {
    return await this.manager.findOne(Nomenclature, id);
  }

  async checkNomenclatureIfExist(description: string): Promise<boolean> {
    return !!(await this.manager.findOne(Nomenclature, {
      where: { description: ILike(`%${description}%`) },
    }));
  }

  async createNomenclature({
    description,
  }: CreateNomenClatureParam): Promise<number> {
    const nomenClature = new Nomenclature();
    nomenClature.description = description;
    await this.manager.save(nomenClature);
    return nomenClature.id;
  }

  async updateNomenclature({
    id,
    description,
  }: UpdateNomenClatureParam): Promise<void> {
    const nomenClature = await this.manager.findOneOrFail(Nomenclature, id);
    nomenClature.description = description;
    await this.manager.save(nomenClature);
  }

  async deleteNomenclature(id: number): Promise<void> {
    await this.manager.delete(Nomenclature, id);
  }
}
