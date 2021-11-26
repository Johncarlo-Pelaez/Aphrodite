import { Role } from 'core/enum';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  objectId: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}
