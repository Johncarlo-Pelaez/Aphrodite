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
    return await this.manager.find(User, {
      where: [
        {
          isDeleted: false,
        },
      ],
    });
  }

  async getUser(id: number): Promise<User> {
    return await this.manager.findOne(User, {
      where: { id, isDeleted: false },
    });
  }

  async count(roles?: Role[]): Promise<number> {
    if (roles) {
      return await this.manager.count(User, {
        where: { role: In(roles), isDeleted: false },
      });
    }
    return await this.manager.count(User);
  }

  async getAuthUserByEmail(email: string): Promise<User> {
    return await this.manager.findOne(User, {
      where: { username: email, isActive: true, isDeleted: false },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.manager.findOne(User, {
      where: { username: email, isDeleted: false },
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

  async deleteUser(param: DeleteUserParam): Promise<void> {
    const user = await this.manager.findOneOrFail(User, {
      where: { id: param.id, isDeleted: false },
    });
    user.isDeleted = true;
    user.firstName = 'Deleted User';
    user.lastName = '';
    user.username = `deleteduser@${user.username.split('@')[1]}`;
    user.modifiedDate = param.modifiedDate;
    await this.manager.save(user);
  }
}
