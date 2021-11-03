export enum Role {
  ADMIN = 'ADMIN',
  ENCODER = 'ENCODER',
  REVIEWER = 'REVIEWER',
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdDate: string;
}
