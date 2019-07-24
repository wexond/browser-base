import * as React from 'react';
import { observer } from 'mobx-react';

import { StyledSearchBox, InputContainer, SearchIcon, Input } from './style';
import { isURL } from '~/utils';
import { loadURL } from '~/renderer/views/app/utils';
import store from '~/renderer/views/app/store';
import ToolbarButton from '../../../../Toolbar/ToolbarButton';
import { Suggestions } from '../Suggestions';
import { icons } from '~/renderer/constants';
import AddBookmarkDialog from '../AddBookmarkDialog';

const onClick = async (e: React.MouseEvent<HTMLDivElement>) => {
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
      url = store.searchEngine.url.replace('%s', text);
    }

    e.currentTarget.value = url;

    loadURL(url);
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

  if (store.settings.object.suggestions) {
    store.overlay.suggest();
  }

  store.overlay.scrollRef.current.scrollTop = 0;
  store.overlay.searchBoxValue = e.currentTarget.value;
};

const onStarClick = async (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();

  if (store.addBookmark.visible) {
    return store.addBookmark.hide();
  }

  const { selectedTab } = store.tabs;

  if (!store.overlay.isBookmarked) {
    await store.bookmarks.addItem({
      title: selectedTab.title,
      url: store.overlay.inputRef.current.value,
      parent: store.bookmarks.folders.find(r => r.static === 'main')._id,
      favicon: selectedTab.favicon,
    });
  }

  store.addBookmark.show();
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
          icon={store.overlay.isBookmarked ? icons.starFilled : icons.star}
          onClick={onStarClick}
          onMouseDown={e => e.stopPropagation()}
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
      <AddBookmarkDialog />
      <Suggestions visible={suggestionsVisible} />
    </StyledSearchBox>
  );
});
