import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { OverlayContent } from '../../store/overlay';
import { Default, History, Bookmarks, Settings } from './views';
import {
  StyledOverlay,
  HeaderText,
  HeaderArrow,
  StyledContainer,
} from './style';

export const Header = ({ children, clickable }: any) => {
  return (
    <HeaderText clickable={clickable}>
      {children}
      {clickable && <HeaderArrow />}
    </HeaderText>
  );
};

const onClick = () => {
  if (
    store.tabGroups.currentGroup.tabs.length > 0 &&
    !store.overlay.isNewTab &&
    store.overlay.currentContent === 'default'
  ) {
    store.overlay.visible = false;
  }
  store.overlay.dialTypeMenuVisible = false;
  store.bookmarks.menuVisible = false;
};

export const preventHiding = (e: any) => {
  e.stopPropagation();
  store.overlay.dialTypeMenuVisible = false;
};

export const Overlay = observer(() => {
  return (
    <StyledOverlay visible={store.overlay.visible} onClick={onClick}>
      <Default />
      <History />
      <Bookmarks />
      <Settings />
    </StyledOverlay>
  );
});

interface ContainerProps {
  content: OverlayContent;
  right?: boolean;
  children?: any;
}

export const Container = observer(
  ({ content, right, children }: ContainerProps) => {
    const visible =
      store.overlay.visible && store.overlay.currentContent === content;

    return (
      <StyledContainer visible={visible} right={right}>
        {children}
      </StyledContainer>
    );
  },
);
