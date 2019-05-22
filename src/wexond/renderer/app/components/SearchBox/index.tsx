import * as React from 'react';

import store from '../../store';
import { isURL } from '~/shared/utils/url';
import { observer } from 'mobx-react';
import { StyledSearchBox, InputContainer, SearchIcon, Input } from './style';
import { Suggestions } from '../Suggestions';
import { icons } from '../../constants';
import ToolbarButton from '../ToolbarButton';

const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.which === 13) {
    // Enter.
    e.preventDefault();

    const text = e.currentTarget.value;
    let url = text;

    if (isURL(text) && !text.includes('://')) {
      url = `http://${text}`;
    } else if (!text.includes('://')) {
      url = `https://www.google.com/search?q=${text}`;
    }

    e.currentTarget.value = url;

    const tab = store.tabs.selectedTab;
    if (!tab || store.overlay.isNewTab) {
      store.tabs.addTab({ url, active: true });
    } else {
      tab.url = url;
      tab.callViewMethod('webContents.loadURL', url);
    }

    store.overlay.visible = false;
  }
};

const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  if (store.overlay.inputRef.current) {
    store.overlay.inputRef.current.select();
  }
};

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const key = e.keyCode;
  const { suggestions } = store;
  const { list } = suggestions;
  const input = store.overlay.inputRef.current;

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
    store.overlay.canSuggest = true;
  } else {
    store.overlay.canSuggest = false;
  }

  if (e.keyCode === 38 || e.keyCode === 40) {
    e.preventDefault();
    if (e.keyCode === 40 && suggestions.selected + 1 <= list.length - 1) {
      suggestions.selected++;
    } else if (e.keyCode === 38 && suggestions.selected - 1 >= 0) {
      suggestions.selected--;
    }

    const suggestion = list.find(x => x.id === suggestions.selected);

    input.value = suggestion.primaryText;
  }
};

const onInput = (e: any) => {
  store.overlay.show();
  store.overlay.suggest();
  store.overlay.scrollRef.current.scrollTop = 0;
  store.overlay.searchBoxValue = e.currentTarget.value;
};

const onStarClick = async () => {
  const { selectedTab } = store.tabs;

  await store.bookmarks.addItem({
    title: selectedTab.title,
    url: store.overlay.inputRef.current.value,
    parent: null,
    type: 'item',
    favicon: selectedTab.favicon,
  });
};

export const SearchBox = observer(() => {
  const suggestionsVisible = store.suggestions.list.length !== 0;

  let height = 42;

  for (const s of store.suggestions.list) {
    height += 42;
  }

  return (
    <StyledSearchBox style={{ height }} onClick={onClick}>
      <InputContainer>
        <SearchIcon />
        <Input
          autoFocus
          placeholder="Search or type in URL"
          onKeyPress={onKeyPress}
          onFocus={onInputFocus}
          onChange={onInput}
          onKeyDown={onKeyDown}
          ref={store.overlay.inputRef}
        />
        <ToolbarButton
          invert
          icon={store.overlay.isBookmarked ? icons.starFilled : icons.star}
          onClick={onStarClick}
          style={{
            marginRight: 8,
            display:
              store.tabs.selectedTab &&
              store.tabs.selectedTab.url === store.overlay.searchBoxValue
                ? 'block'
                : 'none',
          }}
        />
      </InputContainer>
      <Suggestions visible={suggestionsVisible} />
    </StyledSearchBox>
  );
});
