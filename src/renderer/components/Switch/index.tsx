import * as React from 'react';

import { colors } from '~/renderer/constants';
import { StyledSwitch, Thumb } from './styles';

interface Props {
  color?: string;
}

interface State {
  activated: boolean;
}

export default class Switch extends React.Component<Props, State> {
  static defaultProps: Props = {
    color: colors.blue['500'],
  };

  public state: State = {
    activated: false,
  };

  private onClick = () => {
    const { activated } = this.state;
    this.setState({ activated: !activated });
  };

  render() {
    const { color } = this.props;
    const { activated } = this.state;

    return (
      <StyledSwitch activated={activated} color={color} onClick={this.onClick}>
        <Thumb activated={activated} color={color} />
      </StyledSwitch>
    );
  }
}
