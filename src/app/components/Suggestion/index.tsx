import { observer } from 'mobx-react';
import { transparency } from 'nersent-ui';
import React from 'react';
import { Dash, Icon, PrimaryText, SecondaryText, StyledSuggestion } from './styles';
import { Icons } from '../../../shared/enums';
import SuggestionItem from '../../models/suggestion-item';
import Store from '../../store';

interface Props {
  suggestion: SuggestionItem;
}

@observer
export default class Suggestion extends React.Component<Props, {}> {
  render() {
    const { suggestion } = this.props;
    const { primaryText, secondaryText } = suggestion;

    const selected = Store.suggestions.selected === suggestion.id;

    let opacity = 1;

    if (suggestion.type === 'no-subheader-search' || suggestion.type === 'search') {
      suggestion.favicon = `../../src/shared/icons/${Icons.Search}`;
      opacity = transparency.light.icons.inactive;
    } else if (suggestion.type === 'no-subheader-website') {
      suggestion.favicon = `../../src/shared/icons/${Icons.Page}`;
      opacity = transparency.light.icons.inactive;
    }

    return (
      <StyledSuggestion selected={selected}>
        <Icon style={{ backgroundImage: `url(${suggestion.favicon})`, opacity }} />
        <PrimaryText>{primaryText}</PrimaryText>
        {primaryText != null && secondaryText != null && <Dash>&mdash;</Dash>}
        <SecondaryText>{secondaryText}</SecondaryText>
      </StyledSuggestion>
    );
  }
}
