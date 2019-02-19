import * as React from 'react';

import store from '../../store';
import { isURL } from '~/shared/utils/url';
import { callBrowserViewMethod } from '~/shared/utils/browser-view';
import { observer } from 'mobx-react';
import { StyledSearchBox, InputContainer, SearchIcon, Input } from './style';
import { Suggestions } from '../Suggestions';

const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.which === 13) {
    // Enter.
    const tab = store.tabsStore.selectedTab;

    e.preventDefault();

    const text = e.currentTarget.value;
    let url = text;

    if (isURL(text) && !text.includes('://')) {
      url = `http://${text}`;
    } else if (!text.includes('://')) {
      url = `https://www.google.com/search?q=${text}`;
    }

    e.currentTarget.value = url;
    tab.url = url;
    callBrowserViewMethod(tab.id, 'loadURL', url);

    store.overlayStore.visible = false;
  }
};

const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  store.overlayStore.inputRef.current.select();
};

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const key = e.keyCode;
  const { suggestionsStore } = store;
  const { suggestions } = suggestionsStore;
  const input = store.overlayStore.inputRef.current;

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
    store.overlayStore.canSuggest = true;
  } else {
    store.overlayStore.canSuggest = false;
  }

  if (e.keyCode === 38 || e.keyCode === 40) {
    e.preventDefault();
    if (
      e.keyCode === 40 &&
      suggestionsStore.selected + 1 <= suggestions.length - 1
    ) {
      suggestionsStore.selected++;
    } else if (e.keyCode === 38 && suggestionsStore.selected - 1 >= 0) {
      suggestionsStore.selected--;
    }

    const suggestion = suggestions.find(
      x => x.id === suggestionsStore.selected,
    );

    input.value = suggestion.primaryText;
  }
};

const onInput = () => {
  store.overlayStore.show();
  store.overlayStore.suggest();
};

const onInputBlur = () => {
  if (store.tabsStore.selectedTab.url === 'about:blank') {
    store.overlayStore.inputRef.current.focus();
  }
};

export const SearchBox = observer(() => {
  const suggestionsVisible = store.suggestionsStore.suggestions.length !== 0;

  return (
    <StyledSearchBox onClick={onClick}>
      <InputContainer>
        <SearchIcon />
        <Input
          placeholder="Search or type in URL"
          onKeyPress={onKeyPress}
          onFocus={onInputFocus}
          onChange={onInput}
          onKeyDown={onKeyDown}
          onBlur={onInputBlur}
          ref={store.overlayStore.inputRef}
        />
      </InputContainer>
      <Suggestions visible={suggestionsVisible} />
    </StyledSearchBox>
  );
});
