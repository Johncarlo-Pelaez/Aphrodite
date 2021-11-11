import { Role, User } from 'src/entities';
import { EntityManager, EntityRepository, In } from 'typeorm';
import {
  CreateUserParam,
  UpdateUserParam,
  DeleteUserParam,
} from './user.params';

@EntityRepository()
export class UserRepository {
  constructor(private readonly manager: EntityManager) {}

  async getUsers(): Promise<User[]> {
    return this.manager.find(User, {
      where: { isDeleted: false },
    });
  }

  async getUser(id: number): Promise<User> {
    return this.manager.findOne(User, id, {
      where: { isDeleted: false },
    });
  }

  async count(roles?: Role[]): Promise<number> {
    if (roles) {
      return this.manager.count(User, {
        where: { role: In(roles), isDeleted: false },
      });
    }
    return this.manager.count(User, {
      where: { isDeleted: false },
    });
  }

  async getAuthUserByEmail(email: string): Promise<User> {
    return this.manager.findOne(User, {
      where: { email, isDeleted: false, isActive: true },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.manager.findOne(User, {
      where: { email, isDeleted: false },
    });
  }

  async createUser(param: CreateUserParam): Promise<number> {
    const user = new User();
    user.email = param.email;
    user.firstName = param.firstName;
    user.lastName = param.lastName;
    user.role = param.role;
    user.createdDate = param.createdDate;
    user.isActive = param.isActive;
    await this.manager.save(user);

    return user.id;
  }

  async updateUser(param: UpdateUserParam): Promise<User> {
    const user = await this.manager.findOneOrFail(User, param.id);
    user.email = param.email;
    user.firstName = param.firstName;
    user.lastName = param.lastName;
    user.isActive = param.isActive;
    user.role = param.role;
    user.modifiedDate = param.modifiedDate;
    return await this.manager.save(user);
  }

  async deleteUser({ id, modifiedDate }: DeleteUserParam): Promise<User> {
    const user = await this.manager.findOneOrFail(User, id);
    user.isDeleted = true;
    user.modifiedDate = modifiedDate;
    return await this.manager.save(user);
  }
}
