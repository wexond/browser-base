import { observer } from 'mobx-react';
import { transparency } from 'nersent-ui';
import React from 'react';
import { Dash, Icon, PrimaryText, SecondaryText, StyledSuggestion } from './styles';
import SuggestionItem from '../../models/suggestion-item';
import Store from '../../store';

const searchIcon = require('../../../shared/icons/search.svg');
const pageIcon = require('../../../shared/icons/page.svg');

interface Props {
  suggestion: SuggestionItem;
}

interface State {
  hovered: boolean;
}

@observer
export default class Suggestion extends React.Component<Props, {}> {
  public state: State = {
    hovered: false,
  };

  public onMouseLeave = () => {
    this.setState({ hovered: false });
  };

  public onMouseEnter = () => {
    this.setState({ hovered: true });
  };

  public render() {
    const { suggestion } = this.props;
    const { hovered } = this.state;
    const { primaryText, secondaryText } = suggestion;
    const { suggestions } = Store.theme.theme;

    const selected = Store.suggestions.selected === suggestion.id;

    let opacity = 1;
    let filter = '';

    let suggestionState = suggestions.item.normal;

    if (selected) {
      suggestionState = suggestions.item.selected;
    } else if (hovered) {
      suggestionState = suggestions.item.hovered;
    }

    if (suggestion.type === 'no-subheader-search' || suggestion.type === 'search') {
      suggestion.favicon = searchIcon;
      opacity = transparency.light.icons.inactive;

      if (suggestionState.iconColor === 'light') {
        filter = 'invert(100%)';
      }
    } else if (suggestion.type === 'no-subheader-website') {
      suggestion.favicon = pageIcon;
      opacity = transparency.light.icons.inactive;

      if (suggestionState.iconColor === 'light') {
        filter = 'invert(100%)';
      }
    }

    if (suggestion.favicon == null) {
      suggestion.favicon = pageIcon;
      opacity = transparency.light.icons.inactive;
    }

    return (
      <StyledSuggestion
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={suggestionState.style}
      >
        <Icon style={{ backgroundImage: `url(${suggestion.favicon})`, opacity, filter }} />
        <PrimaryText>{primaryText}</PrimaryText>
        {primaryText != null && secondaryText != null && <Dash>&mdash;</Dash>}
        <SecondaryText>{secondaryText}</SecondaryText>
      </StyledSuggestion>
    );
  }
}
