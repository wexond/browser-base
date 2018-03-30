import { observer } from 'mobx-react'; // eslint-disable-line
import React from 'react';

// Styles
import { StyledSuggestion, Title, Icon } from './styles';

interface Props {
  children: any;
}

@observer
export default class Suggestion extends React.Component<Props, {}> {
  render() {
    return (
      <StyledSuggestion>
        <Title>{this.props.children}</Title>
        <Icon />
      </StyledSuggestion>
    );
  }
}
