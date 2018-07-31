import { observer } from 'mobx-react';
import React from 'react';
import {
  Dash, Icon, PrimaryText, SecondaryText, StyledSuggestion,
} from './styles';
import SuggestionItem from '../../models/suggestion-item';
import Store from '../../store';
import opacity from '../../../shared/defaults/opacity';

const searchIcon = require('../../../shared/icons/search.svg');
const pageIcon = require('../../../shared/icons/page.svg');

@observer
export default class Suggestion extends React.Component<
  { suggestion: SuggestionItem },
  { hovered: boolean }
  > {
  public state = {
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

    const selected = Store.suggestions.selected === suggestion.id;

    let favicon = suggestion.favicon;

    let customFavicon = true;

    if (suggestion.type === 'no-subheader-search' || suggestion.type === 'search') {
      favicon = searchIcon;
      customFavicon = false;
    } else if (suggestion.type === 'no-subheader-website' || favicon == null) {
      favicon = pageIcon;
      customFavicon = false;
    }

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
            opacity: customFavicon ? 1 : opacity.light.inactiveIcon,
          }}
        />
        <PrimaryText>{primaryText}</PrimaryText>
        {primaryText != null && secondaryText != null && <Dash>&mdash;</Dash>}
        <SecondaryText>{secondaryText}</SecondaryText>
      </StyledSuggestion>
    );
  }
}
