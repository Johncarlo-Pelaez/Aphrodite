import { User } from 'models';

export interface UsersTableProps {
  selectedUser?: User;
  onSelectUser: (user?: User) => void;
}
