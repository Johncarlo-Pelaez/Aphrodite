import { User } from 'models';

export interface UpdateUserModalProps {
  user: User | undefined;
  isVisible: boolean;
  onClose: () => void;
}
