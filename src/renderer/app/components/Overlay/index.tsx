import { observer } from 'mobx-react';
import * as React from 'react';

import store from '../../store';
import {
  StyledOverlay,
  HeaderText,
  HeaderArrow,
  Section,
  Menu,
  Scrollable,
  Title,
  Content,
  DropArrow,
  Toolbar,
  Back,
} from './style';
import { SearchBox } from '../SearchBox';
import { MenuItem } from '../MenuItem';
import { TabGroups } from '../TabGroups';
import { icons } from '../../constants';
import { WeatherCard } from '../WeatherCard';
import { History } from '../History';
import TopSites from '../TopSites';

export const Header = ({ children, clickable }: any) => {
  return (
    <HeaderText clickable={clickable}>
      {children}
      {clickable && <HeaderArrow />}
    </HeaderText>
  );
};

const onClick = () => {
  if (store.tabGroupsStore.currentGroup.tabs.length > 0) {
    store.overlayStore.visible = false;
  }
};

const preventHiding = (e: any) => {
  e.stopPropagation();
};

const onHistoryClick = () => {
  store.overlayStore.scrollRef.current.scrollTop = 0;
  store.overlayStore.currentContent = 'history';
};

const onBackClick = () => {
  store.overlayStore.scrollRef.current.scrollTop = 0;
  store.overlayStore.currentContent = 'default';
};

const onScroll = (e: React.UIEvent) => {
  const { currentContent } = store.overlayStore;

  if (currentContent === 'history') {
    const scrollPos = e.target.scrollTop;
    const scrollMax = e.target.scrollHeight - e.target.clientHeight - 64;

    if (scrollPos >= scrollMax) {
      store.historyStore.itemsLoaded += window.innerHeight / 48;
    }
  }
};

export const Overlay = observer(() => {
  return (
    <StyledOverlay visible={store.overlayStore.visible} onClick={onClick}>
      <Scrollable ref={store.overlayStore.scrollRef} onScroll={onScroll}>
        <Content
          visible={
            store.overlayStore.currentContent === 'default' &&
            store.overlayStore.visible
          }
        >
          <SearchBox />
          {store.historyStore.topSites.length > 0 && (
            <>
              <Title style={{ marginBottom: 24 }}>
                Top Sites
                <DropArrow />
              </Title>
              <TopSites />
            </>
          )}

          <Title>Overview</Title>
          <Section onClick={preventHiding}>
            <Header>Tab groups</Header>
            <TabGroups />
          </Section>
          <Section onClick={preventHiding}>
            <Header>Menu</Header>
            <Menu>
              <MenuItem onClick={onHistoryClick} invert icon={icons.history}>
                History
              </MenuItem>
              <MenuItem invert icon={icons.bookmarks}>
                Bookmarks
              </MenuItem>
              <MenuItem invert icon={icons.download}>
                Downloads
              </MenuItem>
              <MenuItem invert icon={icons.settings}>
                Settings
              </MenuItem>
              <MenuItem invert icon={icons.extensions}>
                Extensions
              </MenuItem>
              <MenuItem invert icon={icons.find}>
                Find
              </MenuItem>
              <MenuItem invert icon={icons.more}>
                More tools
              </MenuItem>
            </Menu>
          </Section>

          <Title>World</Title>
          <WeatherCard />
        </Content>
        <Toolbar
          onClick={preventHiding}
          visible={
            store.overlayStore.currentContent !== 'default' &&
            store.overlayStore.visible
          }
        >
          <Back onClick={onBackClick} />
          History
        </Toolbar>
        <History />
      </Scrollable>
    </StyledOverlay>
  );
});
