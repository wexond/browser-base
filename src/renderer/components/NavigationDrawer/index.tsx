import * as React from 'react';

import {
  StyledNavigationDrawer,
  MenuItems,
  Search,
  Input,
  Title,
  Header,
} from './style';
import { NavigationDrawerItem } from './NavigationDrawerItem';

export const NavigationDrawer = ({
  children,
  title,
  search,
  onSearchInput,
  style,
  dense,
  toggled,
}: {
  children?: any;
  title?: string;
  search?: boolean;
  onSearchInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  onBackClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  style?: any;
  dense?: boolean;
  toggled?: boolean;
}) => {
  return (
    <StyledNavigationDrawer toggled={toggled} style={style} dense={dense}>
      {title !== '' && (
        <Header>
          <Title>{title}</Title>
        </Header>
      )}
      {search && (
        <Search>
          <Input placeholder="Search" onInput={onSearchInput} />
        </Search>
      )}
      <MenuItems>{children}</MenuItems>
    </StyledNavigationDrawer>
  );
};

NavigationDrawer.Item = NavigationDrawerItem;
