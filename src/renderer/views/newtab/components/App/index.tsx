import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';

import store from '../../store';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import {
  Wrapper,
  Content,
  IconItem,
  Menu,
  Image,
  RightBar,
  PreferencesTitle,
  PreferencesSubTitle,
  Back,
} from './style';
import { TopSites } from '../TopSites';
import { icons } from '~/renderer/constants';
import { News } from '../News';
import { WEBUI_BASE_URL, WEBUI_URL_SUFFIX } from '~/constants/files';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuRow,
} from '~/renderer/components/ContextMenu';
import { Switch } from '~/renderer/components/Switch';
import { Dropdown } from '~/renderer/components/Dropdown';

const GlobalStyle = createGlobalStyle`${Style}`;

window.addEventListener('mousedown', () => {
  store.dashboardSettingsVisible = false;
});

const onIconClick = (name: string) => () => {
  window.location.href = `${WEBUI_BASE_URL}${name}${WEBUI_URL_SUFFIX}`;
};

const onTuneClick = () => {
  store.dashboardSettingsVisible = !store.dashboardSettingsVisible;
};

const onBackClick = () => {
  store.preferencesContent = 'main';
};

const onRefreshClick = () => {
  store.image = '';
  setTimeout(() => {
    localStorage.setItem('imageDate', '');
    store.loadImage();
  }, 50);
};

const onShowImageClick = () => {
  store.imageVisible = !store.imageVisible;
};

const onCustomClick = () => {
  store.preferencesContent = 'custom';
};

export default hot(
  observer(() => {
    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <div>
          <GlobalStyle />
          <ContextMenu
            translucent
            style={{ right: 32, top: 68, width: 275 }}
            visible={store.dashboardSettingsVisible}
            onMouseDown={e => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                overflow: store.overflowVisible ? 'visible' : 'hidden',
                position: 'relative',
                transform: 'translate(0, 0)',
              }}
            >
              <div
                style={{
                  opacity: store.preferencesContent === 'main' ? 1 : 0,
                  minWidth: 275,
                  transition: '0.3s opacity, 0.3s transform',
                  top: 0,
                  left: 0,
                  transform:
                    store.preferencesContent === 'main'
                      ? 'none'
                      : 'translateX(-100%)',
                }}
              >
                <PreferencesTitle style={{ marginLeft: 20 }}>
                  Page layout
                </PreferencesTitle>

                <ContextMenuSeparator></ContextMenuSeparator>

                <ContextMenuItem iconSize={28} icon={icons.window}>
                  Focused
                </ContextMenuItem>
                <ContextMenuItem iconSize={28} icon={icons.window}>
                  Inspirational
                </ContextMenuItem>
                <ContextMenuItem iconSize={28} icon={icons.window}>
                  Informational
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={onCustomClick}
                  iconSize={28}
                  icon={icons.window}
                >
                  Custom
                </ContextMenuItem>
              </div>
              <div
                style={{
                  minWidth: 275,
                  position: 'relative',
                  opacity: store.preferencesContent === 'custom' ? 1 : 0,
                  transition: '0.3s max-height, 0.3s transform, 0.3s opacity',
                  maxHeight: store.preferencesContent === 'custom' ? 390 : 200,
                  transform:
                    store.preferencesContent === 'custom'
                      ? 'translateX(-100%)'
                      : 'none',
                }}
              >
                <PreferencesTitle>
                  <Back onClick={onBackClick} icon={icons.back}></Back>
                  Custom
                </PreferencesTitle>
                <ContextMenuSeparator></ContextMenuSeparator>
                <ContextMenuItem onClick={onShowImageClick}>
                  <div style={{ flex: 1 }}>Show image</div>
                  <Switch value={store.imageVisible}></Switch>
                </ContextMenuItem>
                {store.imageVisible && (
                  <>
                    <ContextMenuItem>
                      <div style={{ flex: 1 }}>Change the image daily</div>
                      <Switch value={store.imageVisible}></Switch>
                    </ContextMenuItem>
                    <ContextMenuItem>Choose image...</ContextMenuItem>
                  </>
                )}
                <ContextMenuSeparator></ContextMenuSeparator>
                <ContextMenuItem>
                  <div style={{ flex: 1 }}>Show top sites</div>
                  <Switch value={store.topSitesVisible}></Switch>
                </ContextMenuItem>
                <ContextMenuItem>
                  <div style={{ flex: 1 }}>Show quick menu</div>
                  <Switch value={store.quickMenuVisible}></Switch>
                </ContextMenuItem>
                <ContextMenuSeparator></ContextMenuSeparator>
                <PreferencesSubTitle>News visibility:</PreferencesSubTitle>
                <Dropdown
                  defaultValue="on-scroll"
                  onMouseDown={() => (store.overflowVisible = true)}
                  style={{ margin: '0 20px 8px' }}
                >
                  <Dropdown.Item value="always-visible">
                    Always visible
                  </Dropdown.Item>
                  <Dropdown.Item value="hidden">Hidden</Dropdown.Item>
                  <Dropdown.Item value="on-scroll">
                    Visible on scroll
                  </Dropdown.Item>
                </Dropdown>
              </div>
            </div>
          </ContextMenu>
          <Wrapper>
            <Image src={store.image}></Image>

            <Content>
              <TopSites></TopSites>
            </Content>

            <RightBar>
              <IconItem
                title="Dashboard settings"
                icon={icons.tune}
                onMouseDown={e => e.stopPropagation()}
                onClick={onTuneClick}
              ></IconItem>

              <Menu>
                <IconItem
                  title="Settings"
                  icon={icons.settings}
                  onClick={onIconClick('settings')}
                ></IconItem>
                <IconItem
                  title="History"
                  icon={icons.history}
                  onClick={onIconClick('history')}
                ></IconItem>
                <IconItem
                  title="Bookmarks"
                  icon={icons.bookmarks}
                  onClick={onIconClick('bookmarks')}
                ></IconItem>
                <IconItem
                  title="Downloads"
                  icon={icons.download}
                  onClick={onIconClick('downloads')}
                ></IconItem>
                <IconItem
                  title="Extensions"
                  icon={icons.extensions}
                  onClick={onIconClick('extensions')}
                ></IconItem>
              </Menu>
            </RightBar>
          </Wrapper>
          <Content>
            <News></News>
          </Content>
        </div>
      </ThemeProvider>
    );
  }),
);
