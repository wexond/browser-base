import * as React from 'react';

import { colors } from '~/renderer/constants';
import { StyledSwitch, Thumb } from './styles';

interface Props {
  color?: string;
  onChange?: (value: boolean) => void;
}

interface State {
  activated: boolean;
}

export default class Switch extends React.PureComponent<Props, State> {
  static defaultProps: Props = {
    color: colors.blue['500'],
  };

  public state: State = {
    activated: false,
  };

  public get value() {
    const { activated } = this.state;
    return activated;
  }

  public set value(val: boolean) {
    const { onChange } = this.props;

    this.setState({ activated: val });
    if (onChange) onChange(val);
  }

  private onClick = () => {
    const { activated } = this.state;
    this.value = !activated;
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
