import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Input, CurrentIcon, SearchBox, StyledOmnibox } from './style';
import { Suggestions } from '../Suggestions';
import { ICON_SEARCH, ICON_PAGE } from '~/renderer/constants';
import store from '../../store';

const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.which === 13) {
    // Enter.
    e.preventDefault();

    const text = e.currentTarget.value;
    let url = text;

    const suggestion = store.suggestions.selected;

    if (suggestion) {
      if (suggestion.isSearch) {
        url = store.omnibox.searchEngine.url.replace('%s', text);
      } else if (text.indexOf('://') === -1) {
        url = `http://${text}`;
      }
    }

    e.currentTarget.value = url;

    browser.tabs.update(store.tabId, { url });

    store.omnibox.hide();
  }
};

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const { suggestions } = store;
  const { list } = suggestions;
  const input = store.omnibox.inputRef.current;

  store.omnibox.canSuggest = store.omnibox.getCanSuggest(e.keyCode);

  if (e.key === 'Escape') {
    store.omnibox.hide({ focus: true, escape: true });
  } else if (e.keyCode === 38 || e.keyCode === 40) {
    e.preventDefault();
    if (
      e.keyCode === 40 &&
      suggestions.selectedId + 1 <=
        list.length - 1 + store.omnibox.searchedTabs.length
    ) {
      suggestions.selectedId++;
    } else if (e.keyCode === 38 && suggestions.selectedId - 1 >= 0) {
      suggestions.selectedId--;
    }

    let suggestion = list.find((x) => x.id === suggestions.selectedId);

    if (!suggestion) {
      suggestion = store.omnibox.searchedTabs.find(
        (x) => x.id === suggestions.selectedId,
      );
    }

    input.value = suggestion.isSearch ? suggestion.primaryText : suggestion.url;
  }
};

const onInput = (e: any) => {
  store.omnibox.inputText = e.currentTarget.value;

  if (e.currentTarget.value.trim() === '') {
    store.omnibox.hide({ focus: true });
  }

  // TODO: if (store.settings.object.suggestions) {
  store.omnibox.suggest();
  // }
};

export const Omnibox = observer(() => {
  const ref = React.useRef<HTMLDivElement>();

  const region = store.getRegion('omnibox');
  const suggestionsVisible = store.suggestions.list.length !== 0;

  const onBlur = React.useCallback(() => {
    store.omnibox.hide();
  }, []);

  requestAnimationFrame(() => {
    const { width, height } = ref.current.getBoundingClientRect();
    store.updateRegion('omnibox', {
      left: store.omnibox.x,
      top: store.omnibox.y,
      width,
      height,
      visible: store.omnibox.visible,
    });
  });

  const suggestion = store.suggestions.selected;
  let favicon = ICON_SEARCH;
  let customIcon = true;

  if (suggestion && suggestionsVisible) {
    customIcon = false;

    if (suggestion.isSearch) {
      favicon = store.omnibox.searchEngine.icon;
    } else {
      let u = suggestion.url;
      if (!u.startsWith('http')) u = `http://${u}`;
      favicon = `wexond://favicon/${u}`;
    }
  }

  return (
    <StyledOmnibox
      ref={ref}
      tabIndex={0}
      style={{ left: region.left, top: region.top, width: store.omnibox.width }}
      onBlur={onBlur}
      visible={store.omnibox.visible}
    >
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
          ref={store.omnibox.inputRef}
          onKeyPress={onKeyPress}
        ></Input>
      </SearchBox>
      <Suggestions visible={suggestionsVisible}></Suggestions>
    </StyledOmnibox>
  );
});
