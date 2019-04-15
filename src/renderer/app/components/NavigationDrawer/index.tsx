import * as React from 'react';
import store from '../../store';
import {
  StyledNavigationDrawer,
  MenuItems,
  Search,
  Input,
  Title,
  Back,
  Header,
} from './style';
import { NavigationDrawerItem } from './NavigationDrawerItem';

const onBackClick = () => {
  store.overlay.currentContent = 'default';
};

export const NavigationDrawer = ({
  children,
  title,
  onSearchInput,
  search,
}: {
  children?: any;
  title?: string;
  onSearchInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  search?: boolean;
}) => {
  return (
    <StyledNavigationDrawer>
      <Header>
        <Back onClick={onBackClick} />
        <Title>{title}</Title>
      </Header>
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
