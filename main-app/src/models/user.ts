export enum Role {
  ADMIN = 'ADMIN',
  ENCODER = 'ENCODER',
  REVIEWER = 'REVIEWER',
}

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdDate: string;
};
