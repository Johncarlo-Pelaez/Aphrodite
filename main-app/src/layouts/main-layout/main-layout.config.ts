import { MenuItem } from 'core/types';

export { getMainMenuItems };

const getMainMenuItems = (): MenuItem[] => {
  return [
    {
      label: 'Home',
      path: '/',
    },
    {
      label: 'Users',
      path: '/users',
    },
    {
      label: 'Reports',
      path: '/reports',
    },
  ];
};
