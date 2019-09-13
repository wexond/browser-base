import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { Style } from '../../style';
import { StyledApp, Input } from './style';
import store from '../../store';
import { loadURL } from '~/renderer/views/app/utils/view';
import { callViewMethod, isURL } from '~/utils';

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
  }
};

export const App = observer(() => {
  return (
    <ThemeProvider theme={store.theme}>
      <StyledApp visible={store.visible}>
        <GlobalStyle />
        <Input
          onKeyPress={onKeyPress}
          placeholder="Search or type in an URL"
        ></Input>
      </StyledApp>
    </ThemeProvider>
  );
});
