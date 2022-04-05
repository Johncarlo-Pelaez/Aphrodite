import { Role } from 'src/entities';

export interface GetUsersParam {
  roles?: Role[];
  isActive?: boolean;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}

export interface CreateUserParam {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdDate: Date;
}

export interface UpdateUserParam {
  id: number;
  firstName: string;
  lastName: string;
  role: Role;
  modifiedDate: Date;
  isActive?: boolean;
}

export interface DeleteUserParam {
  id: number;
  modifiedDate: Date;
}
