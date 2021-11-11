import { NomenClature } from 'src/entities';
import { EntityManager, EntityRepository } from 'typeorm';
import {
  CreateNomenClatureParam,
  UpdateNomenClatureParam,
} from './nomen-clature.params';

@EntityRepository()
export class NomenClatureRepository {
  constructor(private readonly manager: EntityManager) {}

  async getNomenClatures(): Promise<NomenClature[]> {
    return this.manager.find(NomenClature, {
      order: { description: 'ASC' },
    });
  }

  async getNomenClature(id: number): Promise<NomenClature> {
    return this.manager.findOne(NomenClature, id);
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
  }: UpdateNomenClatureParam): Promise<NomenClature> {
    const nomenClature = await this.manager.findOneOrFail(NomenClature, id);
    nomenClature.description = description;
    return await this.manager.save(nomenClature);
  }

  async deleteNomenClature(id: number): Promise<void> {
    await this.manager.delete(NomenClature, id);
  }
}
