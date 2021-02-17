import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';

import { StyledApp, Input, CurrentIcon, SearchBox } from './style';
import store from '../../store';
import { callViewMethod } from '~/utils/view';
import { ipcRenderer } from 'electron';
import { Suggestions } from '../Suggestions';
import { ICON_SEARCH, ICON_PAGE } from '~/renderer/constants';
import { UIStyle } from '~/renderer/mixins/default-styles';
import {
  COMPACT_TITLEBAR_HEIGHT,
  DEFAULT_TITLEBAR_HEIGHT,
  TOOLBAR_HEIGHT,
} from '~/constants/design';

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

    store.hide();
  }
};

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const { suggestions } = store;
  const { list } = suggestions;
  const input = store.inputRef.current;

  store.canSuggest = store.getCanSuggest(e.keyCode);

  if (e.key === 'Escape') {
    store.hide({ focus: true, escape: true });
  } else if (e.keyCode === 38 || e.keyCode === 40) {
    e.preventDefault();
    if (
      e.keyCode === 40 &&
      suggestions.selected + 1 <= list.length - 1 + store.searchedTabs.length
    ) {
      suggestions.selected++;
    } else if (e.keyCode === 38 && suggestions.selected - 1 >= 0) {
      suggestions.selected--;
    }

    let suggestion = list.find((x) => x.id === suggestions.selected);

    if (!suggestion) {
      suggestion = store.searchedTabs.find(
        (x) => x.id === suggestions.selected,
      );
    }

    input.value = suggestion.isSearch ? suggestion.primaryText : suggestion.url;
  }
};

const onInput = (e: any) => {
  store.inputText = e.currentTarget.value;

  if (e.currentTarget.value.trim() === '') {
    store.hide({ focus: true });
  }

  // TODO: if (store.settings.object.suggestions) {
  store.suggest();
  // }
};

export const App = observer(() => {
  const suggestionsVisible = store.suggestions.list.length !== 0;

  let height = 0;

  if (suggestionsVisible) {
    for (const s of store.suggestions.list) {
      height += 38;
    }
  }

  requestAnimationFrame(() => {
    ipcRenderer.send(`height-${store.id}`, height);
  });

  const suggestion = store.suggestions.selectedSuggestion;
  let favicon = ICON_SEARCH;
  let customIcon = true;

  if (suggestion && suggestionsVisible) {
    favicon = suggestion.favicon;
    customIcon = false;

    if (suggestion.isSearch) {
      favicon = store.searchEngine.icon;
    } else if (
      favicon == null ||
      favicon.trim() === '' ||
      favicon === ICON_PAGE
    ) {
      favicon = ICON_PAGE;
      customIcon = true;
    }
  }

  return (
    <ThemeProvider
      theme={{
        ...store.theme,
        searchBoxHeight:
          store.settings.topBarVariant === 'compact'
            ? COMPACT_TITLEBAR_HEIGHT
            : TOOLBAR_HEIGHT - 1,
      }}
    >
      <StyledApp>
        <UIStyle />
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
            ref={store.inputRef}
            onKeyPress={onKeyPress}
          ></Input>
        </SearchBox>
        <Suggestions visible={suggestionsVisible}></Suggestions>
      </StyledApp>
    </ThemeProvider>
  );
});
