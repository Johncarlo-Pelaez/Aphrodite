import { Role, User } from 'src/entities';
import { EntityManager, EntityRepository, In } from 'typeorm';
import { CreateUserParam } from './user.params';

@EntityRepository()
export class UserRepository {
  constructor(private readonly manager: EntityManager) {}

  async getUsers(): Promise<User[]> {
    return this.manager.find(User);
  }

  async getUser(id: number): Promise<User> {
    return this.manager.findOne(User, id);
  }

  async count(roles?: Role[]): Promise<number> {
    if (roles) {
      return this.manager.count(User, {
        where: { role: In(roles) },
      });
    }
    return this.manager.count(User);
  }

  async createUser(param: CreateUserParam): Promise<number> {
    const user = new User();
    user.email = param.email;
    user.firstName = param.firstName;
    user.lastName = param.lastName;
    user.role = param.role;
    user.createdDate = param.createdDate;
    await this.manager.save(user);

    return user.id;
  }
}
