import { observer } from 'mobx-react';
import React from 'react';
import {
  Dash,
  Icon,
  PrimaryText,
  SecondaryText,
  StyledSuggestion,
} from './styles';
import { Suggestion } from 'interfaces';
import store from 'app-store';
import { icons, transparency } from 'defaults';

interface Props {
  suggestion: Suggestion;
}

@observer
export default class extends React.Component<Props> {
  public onMouseLeave = () => {
    this.props.suggestion.hovered = false;
  };

  public onMouseEnter = () => {
    this.props.suggestion.hovered = true;
  };

  public render() {
    const { suggestion } = this.props;
    const { hovered } = suggestion;
    const { primaryText, secondaryText } = suggestion;

    const selected = store.suggestionsStore.selected === suggestion.id;

    let { favicon } = suggestion;

    if (favicon == null || favicon.trim() === '') {
      favicon = icons.page;
    }

    const customFavicon = favicon !== icons.page && favicon !== icons.search;

    return (
      <StyledSuggestion
        selected={selected}
        hovered={hovered}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Icon
          style={{
            backgroundImage: `url(${favicon})`,
            opacity: customFavicon ? 1 : transparency.light.inactiveIcon,
          }}
        />
        <PrimaryText>{primaryText}</PrimaryText>
        {primaryText != null && secondaryText != null && <Dash>&mdash;</Dash>}
        <SecondaryText>{secondaryText}</SecondaryText>
      </StyledSuggestion>
    );
  }
}
