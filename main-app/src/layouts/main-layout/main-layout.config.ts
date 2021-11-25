import { MenuItem } from 'core/types';

export { getMainMenuItems };

const getMainMenuItems = (): MenuItem[] => {
  return [
    {
      label: 'Reports',
      path: '/reports',
    },
  ];
};
