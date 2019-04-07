import { observer } from 'mobx-react';
import * as React from 'react';
import { TweenLite } from 'gsap';

import store from '../../store';
import {
  StyledOverlay,
  HeaderText,
  HeaderArrow,
  Separator,
  Section,
  Menu,
  Scrollable,
  Title,
  Content,
} from './style';
import { BottomSheet } from '../BottomSheet';
import { SearchBox } from '../SearchBox';
import { MenuItem } from '../MenuItem';
import { TabGroups } from '../TabGroups';
import { icons } from '../../constants';

const Header = ({ children }: any) => {
  return (
    <HeaderText>
      <div style={{ display: 'inline-block' }}>{children}</div>
      <HeaderArrow />
    </HeaderText>
  );
};

const onClick = () => {
  store.overlayStore.visible = false;
};

const onBsClick = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

export const Overlay = observer(() => {
  return (
    <StyledOverlay visible={store.overlayStore.visible} onClick={onClick}>
      <Scrollable ref={store.overlayStore.scrollRef}>
        <Content>
          <SearchBox />
          <Title>Overview</Title>
          <Section>
            <Header>Tab groups</Header>
            <TabGroups />
          </Section>
          <Section>
            <Header>Menu</Header>
            <Menu>
              <MenuItem icon={icons.history}>History</MenuItem>
              <MenuItem icon={icons.bookmarks}>Bookmarks</MenuItem>
              <MenuItem icon={icons.download}>Downloads</MenuItem>
              <MenuItem icon={icons.settings}>Settings</MenuItem>
              <MenuItem icon={icons.extensions}>Extensions</MenuItem>
              <MenuItem icon={icons.window}>New window</MenuItem>
              <MenuItem icon={icons.window}>New incognito window</MenuItem>
              <MenuItem icon={icons.find}>Find</MenuItem>
              <MenuItem icon={icons.more}>More tools</MenuItem>
            </Menu>
          </Section>
        </Content>
      </Scrollable>
    </StyledOverlay>
  );
});
