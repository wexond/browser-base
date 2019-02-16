import * as React from 'react';

import store from '../../store';
import { isURL } from '~/shared/utils/url';
import { callBrowserViewMethod } from '~/shared/utils/browser-view';
import { observer } from 'mobx-react';
import { StyledSearchBox, InputContainer, SearchIcon, Input } from './style';

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
  e.currentTarget.select();
};

export const SearchBox = observer(() => {
  return (
    <StyledSearchBox onClick={onClick}>
      <InputContainer>
        <SearchIcon />
        <Input
          placeholder="Search or type in URL"
          onKeyPress={onKeyPress}
          onFocus={onInputFocus}
          ref={store.overlayStore.inputRef}
        />
      </InputContainer>
    </StyledSearchBox>
  );
});
