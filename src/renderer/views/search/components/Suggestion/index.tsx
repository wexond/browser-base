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

interface Props {
  suggestion: ISuggestion;
}

const onMouseEnter = (suggestion: ISuggestion) => () => {
  suggestion.hovered = true;
};

const onMouseLeave = (suggestion: ISuggestion) => () => {
  suggestion.hovered = false;
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
      onMouseEnter={onMouseEnter(suggestion)}
      onMouseLeave={onMouseLeave(suggestion)}
    >
      <Icon
        style={{
          backgroundImage: `url(${favicon})`,
          opacity: customFavicon ? 1 : transparency.icons.inactive,
        }}
      />
      <PrimaryText>{primaryText}</PrimaryText>
      {primaryText != null && secondaryText != null && <Dash>&mdash;</Dash>}
      <SecondaryText>{secondaryText}</SecondaryText>
    </StyledSuggestion>
  );
});
