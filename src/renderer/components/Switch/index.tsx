import * as React from 'react';

import { colors } from '~/renderer/constants';
import { StyledSwitch, Thumb } from './styles';

interface Props {
  color?: string;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
}

interface State {
  activated: boolean;
}

export default class Switch extends React.PureComponent<Props, State> {
  private static defaultProps: Props = {
    color: colors.blue['500'],
    defaultValue: false,
  };

  public state: State = {
    activated: null,
  };

  public get value() {
    const { defaultValue } = this.props;
    const { activated } = this.state;
    return activated == null ? defaultValue : activated;
  }

  public set value(val: boolean) {
    this.setState({ activated: val });
  }

  private onClick = () => {
    const { onChange } = this.props;

    this.value = !this.value;

    if (onChange) onChange(this.value);
  };

  public render() {
    const { color } = this.props;
    const activated = this.value;

    return (
      <StyledSwitch activated={activated} color={color} onClick={this.onClick}>
        <Thumb activated={activated} color={color} />
      </StyledSwitch>
    );
  }
}
