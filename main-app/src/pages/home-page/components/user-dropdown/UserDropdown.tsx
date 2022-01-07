import { ReactElement, useMemo } from 'react';
import { AutoSuggestField } from 'core/ui';
import { useUsers } from 'hooks';

export interface UserOption extends Record<string, unknown> {
  id: number;
  label: string;
  username: string;
}

export interface UserDropdownProps {
  value?: UserOption;
  onChange: (value?: UserOption) => void;
}

export const UserDropdown = (props: UserDropdownProps): ReactElement => {
  const { value, onChange: triggerChange } = props;
  const { data: users, isLoading, isError } = useUsers();
  const options: UserOption[] = useMemo(
    () =>
      users?.map((u) => ({
        id: u.id,
        label: `${u.firstName} ${u.lastName}`,
        username: u.username,
      })) ?? [],
    [users],
  );

  return (
    <AutoSuggestField
      placeholder="Filter by user"
      isLoading={isLoading}
      isInvalid={isError}
      options={options}
      value={value ? [value] : []}
      onChange={(options: unknown[]) => {
        triggerChange(
          (!!options?.length ? options[0] : undefined) as UserOption,
        );
      }}
    />
  );
};

export default UserDropdown;
