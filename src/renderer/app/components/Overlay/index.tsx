import { observer } from 'mobx-react';
import * as React from 'react';

import store from '../../store';
import {
  StyledOverlay,
  HeaderText,
  HeaderArrow,
  Section,
  Scrollable,
  Title,
  Content,
  DropArrow,
  Container,
  Actions,
  Menu,
  MenuItem,
} from './style';
import { SearchBox } from '../SearchBox';
import { TabGroups } from '../TabGroups';
import { icons } from '../../constants';
import { WeatherCard } from '../WeatherCard';
import { History } from '../History';
import { Bookmarks } from '../Bookmarks';
import { Bubble } from '../Bubble';
import { BookmarksDial } from './Dials/bookmarks';
import { TopSites } from './Dials/top-sites';
import DownloadItem from '../DownloadItem';

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
  store.overlay.dialTypeMenuVisible = false;
};

const preventHiding = (e: any) => {
  e.stopPropagation();
  store.overlay.dialTypeMenuVisible = false;
};

const changeContent = (content: 'history' | 'default' | 'bookmarks') => () => {
  store.overlay.currentContent = content;
};

const changeDialType = (type: 'top-sites' | 'bookmarks') => () => {
  store.settings.dialType = type;
  store.saveSettings();
};

const onDialTitleClick = (e: any) => {
  e.stopPropagation();
  store.overlay.dialTypeMenuVisible = !store.overlay.dialTypeMenuVisible;
};

export const Dial = observer(() => {
  const { dialType } = store.settings;

  return (
    <>
      {(store.history.topSites.length > 0 ||
        store.bookmarks.list.length > 0) && (
        <>
          <Title
            onClick={onDialTitleClick}
            style={{ marginBottom: 24, cursor: 'pointer' }}
          >
            {dialType === 'bookmarks' ? 'Bookmarks' : 'Top Sites'}
            <DropArrow />
            <Menu
              style={{ top: 42 }}
              visible={store.overlay.dialTypeMenuVisible}
            >
              <MenuItem
                icon={icons.fire}
                selected={dialType === 'top-sites'}
                onClick={changeDialType('top-sites')}
              >
                Top Sites
              </MenuItem>
              <MenuItem
                icon={icons.bookmarks}
                selected={dialType === 'bookmarks'}
                onClick={changeDialType('bookmarks')}
              >
                Bookmarks
              </MenuItem>
            </Menu>
          </Title>
          {dialType === 'bookmarks' ? <BookmarksDial /> : <TopSites />}
        </>
      )}
    </>
  );
});

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
            <Dial />

            <Title>Overview</Title>
            <Section onClick={preventHiding}>
              <Header>Tab groups</Header>
              <TabGroups />
            </Section>
            {store.downloads.list.length > 0 && (
              <Section onClick={preventHiding}>
                <Header>Downloads</Header>
                {store.downloads.list.map(item => (
                  <DownloadItem data={item} key={item.id} />
                ))}
              </Section>
            )}
            <Section onClick={preventHiding}>
              <Header>Menu</Header>
              <Actions>
                <Bubble
                  onClick={changeContent('history')}
                  invert
                  icon={icons.history}
                >
                  History
                </Bubble>
                <Bubble
                  onClick={changeContent('bookmarks')}
                  invert
                  icon={icons.bookmarks}
                >
                  Bookmarks
                </Bubble>
                <Bubble disabled invert icon={icons.download}>
                  Downloads
                </Bubble>
                <Bubble disabled invert icon={icons.settings}>
                  Settings
                </Bubble>
                <Bubble disabled invert icon={icons.extensions}>
                  Extensions
                </Bubble>
                <Bubble disabled invert icon={icons.find}>
                  Find
                </Bubble>
                <Bubble disabled invert icon={icons.more}>
                  More tools
                </Bubble>
              </Actions>
            </Section>

            <Title>World</Title>
            <WeatherCard />
          </Content>
        </Scrollable>
      </Container>
      <History />
      <Bookmarks />
    </StyledOverlay>
  );
});
