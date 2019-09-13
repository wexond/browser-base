import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { Style } from '../../style';
import { StyledApp, Input, SearchIcon } from './style';
import store from '../../store';
import { callViewMethod, isURL } from '~/utils';
import { ipcRenderer } from 'electron';

const GlobalStyle = createGlobalStyle`${Style}`;

const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.which === 13) {
    // Enter.
    e.preventDefault();

    const text = e.currentTarget.value;
    let url = text;

    if (isURL(text) && !text.includes('://')) {
      url = `http://${text}`;
    } else if (!text.includes('://')) {
      // url = store.searchEngine.url.replace('%s', text);
      url = 'https://www.google.com/search?q=%s'.replace('%s', text);
    }

    e.currentTarget.value = url;

    callViewMethod(1, store.tabId, 'webContents.loadURL', url);

    setTimeout(() => {
      ipcRenderer.send(`hide-${store.id}`);
    });
  }
};

const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  requestAnimationFrame(() => {
    store.inputRef.current.select();
  });
};

export const App = observer(() => {
  return (
    <ThemeProvider theme={store.theme}>
      <StyledApp visible={store.visible}>
        <GlobalStyle />
        <SearchIcon />
        <Input
          onFocus={onFocus}
          ref={store.inputRef}
          onKeyPress={onKeyPress}
          placeholder="Search or type in an URL"
        ></Input>
      </StyledApp>
    </ThemeProvider>
  );
});
