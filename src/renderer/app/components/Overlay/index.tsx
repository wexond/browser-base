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

const Header = ({ children }: any) => {
  return (
    <HeaderText>
      <div style={{ display: 'inline-block' }}>{children}</div>
      <HeaderArrow />
    </HeaderText>
  );
};

const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
  const target = e.currentTarget;
  const bsHeight = store.overlayStore.bsRef.getBoundingClientRect().height;

  if (bsHeight <= window.innerHeight) {
    if (e.deltaY > 0) {
      if (target.scrollTop === 0) {
        TweenLite.to(target, 0.2, {
          scrollTop: bsHeight - 275,
        });
      }
    } else {
      if (target.scrollTop === target.scrollHeight - window.innerHeight) {
        TweenLite.to(target, 0.2, {
          scrollTop: 0,
        });
      }
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
          innerRef={(r: any) => (store.overlayStore.bsRef = r)}
        >
          <Section>
            <Header>Tab groups</Header>
            <TabGroups />
          </Section>
          <Separator />
          <Section>
            <Menu>
              <MenuItem>History</MenuItem>
              <MenuItem>Bookmarks</MenuItem>
              <MenuItem>Downloads</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Extensions</MenuItem>
              <MenuItem>New window</MenuItem>
              <MenuItem>New incognito window</MenuItem>
              <MenuItem>Find</MenuItem>
              <MenuItem>More tools</MenuItem>
            </Menu>
          </Section>
        </BottomSheet>
      </Scrollable>
    </StyledOverlay>
  );
});
