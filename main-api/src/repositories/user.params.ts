import { Role } from 'src/entities';

export interface CreateUserParam {
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  createdDate: Date;
  isActive?: boolean;
}

export interface UpdateUserParam {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  modifiedDate: Date;
  isActive?: boolean;
}

export interface DeleteUserParam {
  id: number;
  modifiedDate: Date;
}
