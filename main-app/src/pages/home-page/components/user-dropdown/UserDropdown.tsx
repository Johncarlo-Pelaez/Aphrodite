import { ReactElement } from 'react';
import { AutoSuggestField } from 'core/ui';
import { useUsers } from 'hooks';

export interface UserDropdownProps {
  value?: string;
  onChange: (username?: string) => void;
}

export const UserDropdown = (props: UserDropdownProps): ReactElement => {
  const { value, onChange: triggerChange } = props;
  const { data: users, isLoading, isError } = useUsers();
  const options = users?.map((u) => u.username) ?? [];

  return (
    <AutoSuggestField
      placeholder="Filter by user"
      isLoading={isLoading}
      isInvalid={isError}
      options={options}
      value={value ? [value] : []}
      onChange={(options) => {
        triggerChange(
          !!options.length && typeof options[0] === 'string'
            ? options[0]
            : undefined,
        );
      }}
    />
  );
};

export default UserDropdown;
