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

const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
  const bsHeight = store.overlayStore.bsRef.getBoundingClientRect().height;

  if (bsHeight <= window.innerHeight) {
    if (e.deltaY > 0) {
      store.suggestionsStore.suggestions = [];
    }
  }
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
      <SearchBox />
      <Scrollable onWheel={onWheel} ref={store.overlayStore.scrollRef}>
        <BottomSheet
          visible={store.overlayStore.visible}
          onClick={onBsClick}
          bottom={store.overlayStore.bottom}
          innerRef={(r: any) => (store.overlayStore.bsRef = r)}
        >
          <Section style={{ paddingTop: 8 }}>
            <Header>Tab groups</Header>
            <TabGroups />
          </Section>
          <Separator />
          <Section>
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
        </BottomSheet>
      </Scrollable>
    </StyledOverlay>
  );
});
