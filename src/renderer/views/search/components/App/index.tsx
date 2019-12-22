import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Style } from '../../style';
import { StyledApp, Input, CurrentIcon, SearchBox } from './style';
import store from '../../store';
import { callViewMethod } from '~/utils/view';
import { ipcRenderer } from 'electron';
import { Suggestions } from '../Suggestions';
import { icons } from '~/renderer/constants';

const GlobalStyle = createGlobalStyle`${Style}`;

const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.which === 13) {
    // Enter.
    e.preventDefault();

    const text = e.currentTarget.value;
    let url = text;

    const suggestion = store.suggestions.selectedSuggestion;

    if (suggestion) {
      if (suggestion.isSearch) {
        url = store.searchEngine.url.replace('%s', text);
      } else if (text.indexOf('://') === -1) {
        url = `http://${text}`;
      }
    }

    e.currentTarget.value = url;

    callViewMethod(store.tabId, 'loadURL', url);

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

    const suggestion = store.suggestions.selectedSuggestion;
    let favicon = icons.search;
    let customIcon = true;

    if (suggestion && suggestionsVisible) {
      favicon = suggestion.favicon;
      customIcon = false;

      if (suggestion.isSearch) {
        favicon = store.searchEngine.icon;
      } else if (favicon == null || favicon.trim() === '') {
        favicon = icons.page;
        customIcon = true;
      }
    }

    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <StyledApp visible={store.visible}>
          <GlobalStyle />
          <SearchBox>
            <CurrentIcon
              style={{
                backgroundImage: `url(${favicon})`,
                filter:
                  customIcon && store.theme['dialog.lightForeground']
                    ? 'invert(100%)'
                    : 'none',
                opacity: customIcon ? 0.54 : 1,
              }}
            ></CurrentIcon>
            <Input
              onKeyDown={onKeyDown}
              onInput={onInput}
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
