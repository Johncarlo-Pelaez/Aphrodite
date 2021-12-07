import { Role, User } from 'src/entities';
import { EntityManager, EntityRepository, In } from 'typeorm';
import { CreateUserParam, UpdateUserParam } from './user.params';

@EntityRepository()
export class UserRepository {
  constructor(private readonly manager: EntityManager) {}

  async getUsers(): Promise<User[]> {
    return await this.manager.find(User);
  }

  async getUser(id: number): Promise<User> {
    return await this.manager.findOne(User, {
      where: { id },
    });
  }

  async count(roles?: Role[]): Promise<number> {
    if (roles) {
      return await this.manager.count(User, {
        where: { role: In(roles) },
      });
    }
    return await this.manager.count(User);
  }

  async getAuthUserByEmail(email: string): Promise<User> {
    return await this.manager.findOne(User, {
      where: { username: email, isActive: true },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.manager.findOne(User, {
      where: { username: email },
    });
  }

  async createUser(param: CreateUserParam): Promise<number> {
    const user = new User();
    user.username = param.email;
    user.firstName = param.firstName;
    user.lastName = param.lastName;
    user.role = param.role;
    user.createdDate = param.createdDate;
    user.objectId = param.objectId;
    user.isActive = true;
    await this.manager.save(user);
    return user.id;
  }

  async updateUser(param: UpdateUserParam): Promise<void> {
    const user = await this.manager.findOneOrFail(User, {
      where: { id: param.id },
    });
    user.firstName = param.firstName;
    user.lastName = param.lastName;
    user.isActive = param.isActive ?? true;
    user.role = param.role;
    user.modifiedDate = param.modifiedDate;
    await this.manager.save(user);
  }
}
