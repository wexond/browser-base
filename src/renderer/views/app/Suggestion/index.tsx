import { observer } from 'mobx-react';
import React from 'react';
import store from '../../../store';
import {
  Dash,
  Icon,
  PrimaryText,
  SecondaryText,
  StyledSuggestion,
} from './styles';

import { icons, opacity } from '../../../../defaults';
import { SuggestionItem } from '../../../../interfaces';
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
  }

  public onMouseEnter = () => {
    this.setState({ hovered: true });
  }

  public render() {
    const { suggestion } = this.props;
    const { hovered } = this.state;
    const { primaryText, secondaryText } = suggestion;

    const selected = store.selectedSuggestion === suggestion.id;

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
