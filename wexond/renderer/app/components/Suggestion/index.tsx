import { observer } from 'mobx-react';
import * as React from 'react';

import { Suggestion } from '../../models';
import store from '../../store';
import { icons } from '../../constants';
import { transparency } from '~/renderer/constants';
import {
  StyledSuggestion,
  PrimaryText,
  Dash,
  SecondaryText,
  Icon,
} from './style';

interface Props {
  suggestion: Suggestion;
}

const onMouseEnter = (suggestion: Suggestion) => () => {
  suggestion.hovered = true;
};

const onMouseLeave = (suggestion: Suggestion) => () => {
  suggestion.hovered = false;
};

export const SuggestionComponent = observer(({ suggestion }: Props) => {
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
      onMouseEnter={onMouseEnter(suggestion)}
      onMouseLeave={onMouseLeave(suggestion)}
    >
      <Icon
        style={{
          backgroundImage: `url(${favicon})`,
          opacity: customFavicon ? 1 : transparency.icons.inactive,
          filter:
            store.theme['overlay.foreground'] === 'light'
              ? customFavicon
                ? 'none'
                : 'invert(100%)'
              : 'none',
        }}
      />
      <PrimaryText>{primaryText}</PrimaryText>
      {primaryText != null && secondaryText != null && <Dash>&mdash;</Dash>}
      <SecondaryText>{secondaryText}</SecondaryText>
    </StyledSuggestion>
  );
});
