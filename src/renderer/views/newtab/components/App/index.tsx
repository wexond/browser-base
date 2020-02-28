import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';

import store from '../../store';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Wrapper, Content, IconItem, Menu, Image, RightBar } from './style';
import { TopSites } from '../TopSites';
import { icons } from '~/renderer/constants';
import { News } from '../News';
import { WEBUI_BASE_URL, WEBUI_URL_SUFFIX } from '~/constants/files';
import { Preferences } from '../Preferences';

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

const onRefreshClick = () => {
  store.image = '';
  setTimeout(() => {
    localStorage.setItem('imageDate', '');
    store.loadImage();
  }, 50);
};

export default hot(
  observer(() => {
    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <div>
          <GlobalStyle />

          <Preferences />

          <Wrapper>
            <Image src={store.imageVisible ? store.image : ''}></Image>
            <Content>{store.topSitesVisible && <TopSites></TopSites>}</Content>

            <RightBar>
              <IconItem
                imageSet={store.imageVisible}
                title="Dashboard settings"
                icon={icons.tune}
                onMouseDown={e => e.stopPropagation()}
                onClick={onTuneClick}
              ></IconItem>
            </RightBar>
            {store.quickMenuVisible && (
              <Menu>
                <IconItem
                  imageSet={store.imageVisible}
                  title="Settings"
                  icon={icons.settings}
                  onClick={onIconClick('settings')}
                ></IconItem>
                <IconItem
                  imageSet={store.imageVisible}
                  title="History"
                  icon={icons.history}
                  onClick={onIconClick('history')}
                ></IconItem>
                <IconItem
                  imageSet={store.imageVisible}
                  title="Bookmarks"
                  icon={icons.bookmarks}
                  onClick={onIconClick('bookmarks')}
                ></IconItem>
                <IconItem
                  imageSet={store.imageVisible}
                  title="Downloads"
                  icon={icons.download}
                  onClick={onIconClick('downloads')}
                ></IconItem>
                <IconItem
                  imageSet={store.imageVisible}
                  title="Extensions"
                  icon={icons.extensions}
                  onClick={onIconClick('extensions')}
                ></IconItem>
              </Menu>
            )}
          </Wrapper>
          <Content>
            <News></News>
          </Content>
        </div>
      </ThemeProvider>
    );
  }),
);
