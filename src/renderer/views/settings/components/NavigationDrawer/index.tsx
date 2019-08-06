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
}: {
  children?: any;
  title?: string;
  search?: boolean;
  onSearchInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  onBackClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  style?: any;
}) => {
  return (
    <StyledNavigationDrawer>
      <Header>
        <Title>{title}</Title>
      </Header>
      {search && (
        <Search>
          <Input placeholder="Search" onInput={onSearchInput} />
        </Search>
      )}
      <MenuItems style={style}>{children}</MenuItems>
    </StyledNavigationDrawer>
  );
};

NavigationDrawer.Item = NavigationDrawerItem;
