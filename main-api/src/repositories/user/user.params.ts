import { Role } from 'src/entities';

export interface CreateUserParam {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdDate: Date;
  objectId: string;
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
