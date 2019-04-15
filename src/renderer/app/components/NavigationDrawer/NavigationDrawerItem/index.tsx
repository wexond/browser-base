import * as React from 'react';
import { StyledNavigationDrawerItem } from './style';

export const NavigationDrawerItem = ({
  children,
  selected,
  onClick,
}: {
  children: any;
  selected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  return (
    <StyledNavigationDrawerItem selected={selected} onClick={onClick}>
      {children}
    </StyledNavigationDrawerItem>
  );
};
