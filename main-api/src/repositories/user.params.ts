import { Role } from 'src/entities';

export interface CreateUserParam {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdDate: Date;
}
