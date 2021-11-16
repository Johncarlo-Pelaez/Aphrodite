import { NomenClature } from 'src/entities';
import { EntityManager, EntityRepository, ILike } from 'typeorm';
import {
  CreateNomenClatureParam,
  UpdateNomenClatureParam,
} from './nomen-clature.params';

@EntityRepository()
export class NomenClatureRepository {
  constructor(private readonly manager: EntityManager) {}

  async getNomenClatures(): Promise<NomenClature[]> {
    return await this.manager.find(NomenClature, {
      order: { description: 'ASC' },
    });
  }

  async getNomenClature(id: number): Promise<NomenClature> {
    return await this.manager.findOne(NomenClature, id);
  }

  async checkNomenClatureIfExist(description: string): Promise<boolean> {
    return !!(await this.manager.findOne(NomenClature, {
      where: { description: ILike(`%${description}%`) },
    }));
  }

  async createNomenClature({
    description,
  }: CreateNomenClatureParam): Promise<number> {
    const nomenClature = new NomenClature();
    nomenClature.description = description;
    await this.manager.save(nomenClature);
    return nomenClature.id;
  }

  async updateNomenClature({
    id,
    description,
  }: UpdateNomenClatureParam): Promise<void> {
    const nomenClature = await this.manager.findOneOrFail(NomenClature, id);
    nomenClature.description = description;
    await this.manager.save(nomenClature);
  }

  async deleteNomenClature(id: number): Promise<void> {
    await this.manager.delete(NomenClature, id);
  }
}
