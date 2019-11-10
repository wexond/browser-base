import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { transparency, icons } from '~/renderer/constants';
import {
  StyledSuggestion,
  PrimaryText,
  Dash,
  SecondaryText,
  Icon,
} from './style';
import { ISuggestion } from '~/interfaces';
import store from '../../store';
import { remote, ipcRenderer } from 'electron';
import { callViewMethod } from '~/utils/view';
import { isURL } from '~/utils/url';

interface Props {
  suggestion: ISuggestion;
}

const onMouseEnter = (suggestion: ISuggestion) => () => {
  suggestion.hovered = true;
};

const onMouseLeave = (suggestion: ISuggestion) => () => {
  suggestion.hovered = false;
};

const onClick = (suggestion: ISuggestion) => () => {
  let url = suggestion.primaryText;

  if (isURL(url) && !url.includes('://')) {
    url = `http://${url}`;
  } else if (!url.includes('://')) {
    url = store.searchEngine.url.replace('%s', url);
  }

  callViewMethod(
    remote.getCurrentWindow().id,
    store.tabId,
    'webContents.loadURL',
    url,
  );

  setTimeout(() => {
    ipcRenderer.send(`hide-${store.id}`);
  });
};

export const Suggestion = observer(({ suggestion }: Props) => {
  const { hovered } = suggestion;
  const { primaryText, secondaryText } = suggestion;

  const selected = store.suggestions.selected === suggestion.id;

  let { favicon } = suggestion;

  if (favicon == null || favicon.trim() === '') {
    favicon = icons.page;
  }

  const customFavicon = favicon !== icons.page && favicon !== icons.search;

  return (
    <StyledSuggestion
      selected={selected}
      hovered={hovered}
      onClick={onClick(suggestion)}
      onMouseEnter={onMouseEnter(suggestion)}
      onMouseLeave={onMouseLeave(suggestion)}
    >
      <Icon
        style={{
          backgroundImage: `url(${favicon})`,
          opacity: customFavicon ? 1 : transparency.icons.inactive,
          filter: !customFavicon
            ? store.theme['searchBox.suggestions.lightForeground']
              ? 'invert(100%)'
              : 'none'
            : 'none',
        }}
      />
      <PrimaryText>{primaryText}</PrimaryText>
      {primaryText != null && secondaryText != null && <Dash>&mdash;</Dash>}
      <SecondaryText>{secondaryText}</SecondaryText>
    </StyledSuggestion>
  );
});
