import { observer } from 'mobx-react'; // eslint-disable-line
import React from 'react';

// Styles
import { StyledSuggestion, PrimaryText, SecondaryText, Icon, Dash } from './styles';
import SuggestionItem from '../../models/suggestion-item';

interface Props {
  suggestion: SuggestionItem;
}

@observer
export default class Suggestion extends React.Component<Props, {}> {
  render() {
    const { suggestion } = this.props;
    const { primaryText, secondaryText } = suggestion;

    return (
      <StyledSuggestion>
        <Icon style={{ backgroundImage: `url(${suggestion.favicon})` }} />
        <PrimaryText>{primaryText}</PrimaryText>
        {primaryText != null && secondaryText != null && <Dash>&mdash;</Dash>}
        <SecondaryText>{secondaryText}</SecondaryText>
      </StyledSuggestion>
    );
  }
}
