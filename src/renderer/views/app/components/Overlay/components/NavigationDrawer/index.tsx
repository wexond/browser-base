import * as React from 'react';

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
import store from '~/renderer/views/app/store';

const onBack = (cb: (e?: React.MouseEvent) => void) => (
  e: React.MouseEvent,
) => {
  e.stopPropagation();

  if (cb) {
    cb(e);
  }

  store.overlay.currentContent = 'default';
};

export const NavigationDrawer = ({
  children,
  title,
  search,
  onSearchInput,
  onBackClick,
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
        <Back onClick={onBack(onBackClick)} />
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
