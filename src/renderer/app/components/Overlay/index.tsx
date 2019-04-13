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
  Container,
} from './style';
import { SearchBox } from '../SearchBox';
import { MenuItem } from '../MenuItem';
import { TabGroups } from '../TabGroups';
import { icons, TOOLBAR_HEIGHT } from '../../constants';
import { WeatherCard } from '../WeatherCard';
import { History } from '../History';
import TopSites from '../TopSites';
import { Button } from '~/renderer/components/Button';

export const Header = ({ children, clickable }: any) => {
  return (
    <HeaderText clickable={clickable}>
      {children}
      {clickable && <HeaderArrow />}
    </HeaderText>
  );
};

const onClick = () => {
  if (store.tabGroups.currentGroup.tabs.length > 0) {
    store.overlay.visible = false;
  }
};

const preventHiding = (e: any) => {
  e.stopPropagation();
};

const onHistoryClick = () => {
  store.overlay.currentContent = 'history';
};

export const Overlay = observer(() => {
  return (
    <StyledOverlay visible={store.overlay.visible} onClick={onClick}>
      <Container
        visible={
          store.overlay.currentContent === 'default' && store.overlay.visible
        }
      >
        <Scrollable ref={store.overlay.scrollRef}>
          <Content>
            <SearchBox />
            {store.history.topSites.length > 0 && (
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
        </Scrollable>
      </Container>
      <History />
    </StyledOverlay>
  );
});
