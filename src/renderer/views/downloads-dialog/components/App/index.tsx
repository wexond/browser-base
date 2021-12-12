import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';

import { StyledApp } from './style';
import store from '../../store';
import { DownloadItem } from '../DownloadItem';
import { ipcRenderer } from 'electron';
import { UIStyle } from '~/renderer/mixins/default-styles';

const dialogClicked = (e: React.MouseEvent<HTMLDivElement>) => {
  store.closeAllDownloadMenu();
};

export const App = observer(() => {
  const height =
    8 +
    Math.min(8, store.downloads.length) * (64 + 8) +
    (store.downloads.find((x) => x.menuIsOpen === true) ? 200 : 0);
  ipcRenderer.send(`height-${store.id}`, height);

  return (
    <ThemeProvider theme={{ ...store.theme }}>
      <StyledApp
        style={{ maxHeight: store.maxHeight, overflow: 'unset' }}
        visible={store.visible}
        onClick={dialogClicked}
      >
        <UIStyle />
        {store.downloads
          .slice()
          .reverse()
          .map((item) => (
            <DownloadItem item={item} key={item.id}></DownloadItem>
          ))}
      </StyledApp>
    </ThemeProvider>
  );
});
