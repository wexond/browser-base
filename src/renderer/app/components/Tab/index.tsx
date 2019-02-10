import { observer } from 'mobx-react';
import * as React from 'react';

import Preloader from '~/renderer/components/Preloader';
import { Tab } from '~/renderer/app/models';
import store from '~/renderer/app/store';
import {
  StyledTab,
  StyledContent,
  StyledIcon,
  StyledTitle,
  StyledClose,
  StyledBorder,
  StyledOverlay,
} from './style';
import { shadeBlendConvert } from '../../utils';
import { colors, transparency } from '~/renderer/constants';

const removeTab = (tab: Tab) => () => {
  tab.close();
};

const onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

const onMouseDown = (tab: Tab) => (e: React.MouseEvent<HTMLDivElement>) => {
  const { pageX, pageY } = e;

  tab.select();

  store.tabsStore.lastMouseX = 0;
  store.tabsStore.isDragging = true;
  store.tabsStore.mouseStartX = pageX;
  store.tabsStore.tabStartX = tab.left;

  store.tabsStore.lastScrollLeft =
    store.tabsStore.containerRef.current.scrollLeft;
};

const onMouseEnter = (tab: Tab) => () => {
  if (!store.tabsStore.isDragging) {
    store.tabsStore.hoveredTabId = tab.id;
  }
};

const onMouseLeave = () => {
  store.tabsStore.hoveredTabId = -1;
};

const Content = observer(({ tab }: { tab: Tab }) => {
  return (
    <StyledContent collapsed={tab.isExpanded}>
      {!tab.loading && tab.favicon !== '' && (
        <StyledIcon
          isIconSet={tab.favicon !== ''}
          style={{ backgroundImage: `url(${tab.favicon})` }}
        />
      )}
      {tab.loading && <Preloader thickness={6} size={16} />}
      <StyledTitle
        isIcon={tab.isIconSet}
        style={{
          color: tab.isSelected
            ? tab.background
            : `rgba(0, 0, 0, ${transparency.text.high})`,
        }}
      >
        {tab.title}
      </StyledTitle>
    </StyledContent>
  );
});

const Close = observer(({ tab }: { tab: Tab }) => {
  return (
    <StyledClose
      onMouseDown={onCloseMouseDown}
      onClick={removeTab(tab)}
      visible={tab.isExpanded}
    />
  );
});

const Border = observer(({ tab }: { tab: Tab }) => {
  return <StyledBorder visible={tab.borderVisible} />;
});

const Overlay = observer(({ tab }: { tab: Tab }) => {
  return (
    <StyledOverlay
      hovered={tab.isHovered}
      style={{
        backgroundColor: tab.isSelected
          ? shadeBlendConvert(0.8, tab.background)
          : 'rgba(0, 0, 0, 0.04)',
      }}
    />
  );
});

export default observer(({ tab }: { tab: Tab }) => {
  return (
    <StyledTab
      selected={tab.isSelected}
      hovered={tab.isHovered}
      onMouseDown={onMouseDown(tab)}
      onMouseEnter={onMouseEnter(tab)}
      onMouseLeave={onMouseLeave}
      isClosing={tab.isClosing}
      ref={tab.ref}
      style={{
        backgroundColor: tab.isSelected
          ? shadeBlendConvert(0.85, tab.background)
          : 'transparent',
      }}
    >
      <Content tab={tab} />
      <Close tab={tab} />
      <Border tab={tab} />
      <Overlay tab={tab} />
    </StyledTab>
  );
});
