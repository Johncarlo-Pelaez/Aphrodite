import { Lookup } from 'src/entities';
import { EntityManager, EntityRepository } from 'typeorm';

@EntityRepository()
export class LookupRepository {
  constructor(private readonly manager: EntityManager) {}

  async getLookups(): Promise<Lookup[]> {
    return await this.manager.find(Lookup, {
      order: { nomenClature: 'ASC' },
    });
  }
}
