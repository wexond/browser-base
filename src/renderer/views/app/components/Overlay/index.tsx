import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../store';
import { OverlayContent } from '../../store/overlay';
import { Default, History, Bookmarks } from './views';
import {
  StyledOverlay,
  HeaderText,
  HeaderArrow,
  StyledContainer,
  DialogsContainer,
  Dark,
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
  store.autoFill.menuVisible = false;
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
      <Dialogs />
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

export const Dialogs = observer(() => {
  return (
    <DialogsContainer visible={store.overlay.dialogContent != null}>
      <Dark onClick={onClick} />
    </DialogsContainer>
  );
});
