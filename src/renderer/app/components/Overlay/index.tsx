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
} from './style';
import { SearchBox } from '../SearchBox';
import { MenuItem } from '../MenuItem';
import { TabGroups } from '../TabGroups';
import { icons } from '../../constants';
import { callBrowserViewMethod } from '~/shared/utils/browser-view';

const Header = ({ children, clickable }: any) => {
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

const onSiteClick = (url: string) => () => {
  const tab = store.tabsStore.selectedTab;

  if (!tab || store.overlayStore.isNewTab) {
    store.tabsStore.addTab({ url, active: true });
  } else {
    tab.url = url;
    callBrowserViewMethod('webContents.loadURL', tab.id, url);
  }

  store.overlayStore.visible = false;
};

const getSize = (i: number) => {
  const width = 800;
  return (width - 48 - (i - 1)) / i;
};

export const Overlay = observer(() => {
  return (
    <StyledOverlay visible={store.overlayStore.visible} onClick={onClick}>
      <Scrollable ref={store.overlayStore.scrollRef}>
        <Content>
          <SearchBox />
          {store.historyStore.topSites.length > 0 && (
            <>
              <Title style={{ marginBottom: 24 }}>
                Top Sites
                <DropArrow />
              </Title>
              <Menu>
                {store.historyStore.topSites.map(item => (
                  <MenuItem
                    width={getSize(6)}
                    onClick={onSiteClick(item.url)}
                    key={item._id}
                    maxLines={1}
                    iconSize={20}
                    light
                    icon={item.favicon}
                  >
                    {item.title}
                  </MenuItem>
                ))}
              </Menu>
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
              <MenuItem invert icon={icons.history}>
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
        </Content>
      </Scrollable>
    </StyledOverlay>
  );
});
