import { MenuItem } from 'core/types';

export { getMainMenuItems };

const getMainMenuItems = (): MenuItem[] => {
  return [
    {
      label: 'Home',
      path: '/home',
    },
    {
      label: 'User',
      path: '/users',
    },
    {
      label: 'Report',
      path: '/reports',
    },
  ];
};
