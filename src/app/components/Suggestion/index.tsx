import { observer } from 'mobx-react';
import React from 'react';
import {
  Dash, Icon, PrimaryText, SecondaryText, StyledSuggestion,
} from './styles';
import SuggestionItem from '../../models/suggestion-item';
import Store from '../../store';
import transparency from '../../../shared/defaults/opacity';

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
    const { theme } = Store.theme;

    const selected = Store.suggestions.selected === suggestion.id;

    let favicon = suggestion.favicon;

    let opacity = 1;

    type SuggestionState = 'suggestion' | 'suggestionSelected' | 'suggestionHovered';

    let suggestionState: SuggestionState = 'suggestion';

    if (selected) {
      suggestionState = 'suggestionSelected';
    } else if (hovered) {
      suggestionState = 'suggestionHovered';
    }

    if (suggestion.type === 'no-subheader-search' || suggestion.type === 'search') {
      favicon = searchIcon;
      opacity = transparency.light.inactiveIcon;
    } else if (suggestion.type === 'no-subheader-website') {
      favicon = pageIcon;
      opacity = transparency.light.inactiveIcon;
    }

    if (favicon == null) {
      favicon = pageIcon;
      opacity = transparency.light.inactiveIcon;
    }

    return (
      <StyledSuggestion
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={{ ...theme[suggestionState] }}
      >
        <Icon
          style={{
            backgroundImage: `url(${favicon})`,
            ...theme[`${suggestionState}Icon` as SuggestionState],
          }}
        />
        <PrimaryText>{primaryText}</PrimaryText>
        {primaryText != null && secondaryText != null && <Dash>&mdash;</Dash>}
        <SecondaryText>{secondaryText}</SecondaryText>
      </StyledSuggestion>
    );
  }
}
