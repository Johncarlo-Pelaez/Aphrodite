import { Fragment, ReactElement } from 'react';
import { WithChildren } from 'core/types';

type PublicLayoutProps = WithChildren<{}>;

export const PublicLayout = (props: PublicLayoutProps): ReactElement => {
  const { children } = props;

  return <Fragment>{children}</Fragment>;
};

export default PublicLayout;
