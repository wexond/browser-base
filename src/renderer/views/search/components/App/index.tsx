import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Style } from '../../style';
import { StyledApp, Input, SearchIcon, SearchBox } from './style';
import store from '../../store';
import { callViewMethod, isURL } from '~/utils';
import { ipcRenderer, remote } from 'electron';
import { Suggestions } from '../Suggestions';

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
      url = store.searchEngine.url.replace('%s', text);
    }

    e.currentTarget.value = url;

    callViewMethod(
      remote.getCurrentWindow().id,
      store.tabId,
      'webContents.loadURL',
      url,
    );

    setTimeout(() => {
      ipcRenderer.send(`hide-${store.id}`);
    });
  }
};

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const key = e.keyCode;
  const { suggestions } = store;
  const { list } = suggestions;
  const input = store.inputRef.current;

  if (
    key !== 8 && // backspace
    key !== 13 && // enter
    key !== 17 && // ctrl
    key !== 18 && // alt
    key !== 16 && // shift
    key !== 9 && // tab
    key !== 20 && // capslock
    key !== 46 && // delete
    key !== 32 // space
  ) {
    store.canSuggest = true;
  } else {
    store.canSuggest = false;
  }

  if (e.keyCode === 38 || e.keyCode === 40) {
    e.preventDefault();
    if (
      e.keyCode === 40 &&
      suggestions.selected + 1 <= list.length - 1 + store.searchedTabs.length
    ) {
      suggestions.selected++;
    } else if (e.keyCode === 38 && suggestions.selected - 1 >= 0) {
      suggestions.selected--;
    }

    let suggestion = list.find(x => x.id === suggestions.selected);

    if (!suggestion) {
      suggestion = store.searchedTabs.find(x => x.id === suggestions.selected);
    }

    input.value = suggestion.primaryText;
  }
};

const onInput = (e: any) => {
  store.inputText = e.currentTarget.value;

  // TODO: if (store.settings.object.suggestions) {
  store.suggest();
  // }
};

const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  setTimeout(() => {
    store.inputRef.current.select();
  }, 10);
};

export const App = hot(
  observer(() => {
    const suggestionsVisible = store.suggestions.list.length !== 0;

    let height = 0;

    if (suggestionsVisible) {
      for (const s of store.suggestions.list) {
        height += 38;
      }

      for (const s of store.searchedTabs) {
        height += 38;
      }

      if (store.suggestions.list.length > 0) {
        height += 30;
      }

      if (store.searchedTabs.length > 0) {
        height += 30;
      }
    }

    ipcRenderer.send(`height-${store.id}`, height);

    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <StyledApp visible={store.visible}>
          <GlobalStyle />
          <SearchBox>
            <SearchIcon />
            <Input
              onKeyDown={onKeyDown}
              onChange={onInput}
              onFocus={onFocus}
              ref={store.inputRef}
              onKeyPress={onKeyPress}
              placeholder="Search or type in a URL"
            ></Input>
          </SearchBox>
          <Suggestions visible={suggestionsVisible}></Suggestions>
        </StyledApp>
      </ThemeProvider>
    );
  }),
);
