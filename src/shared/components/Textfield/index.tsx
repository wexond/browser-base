import * as React from 'react';

import colors from '../../defaults/colors';
import { TextfieldType } from '../../enums';

import {
  Root, Label, Input, Indicator,
} from './styles';

export interface IProps {
  color?: string;
  type?: TextfieldType;
}

export interface IState {
  focused: boolean;
}

export default class Textfield extends React.Component<IProps, IState> {
  public static defaultProps = {
    color: colors.deepPurple['500'],
    type: TextfieldType.Filled,
  };

  public state: IState = {
    focused: false,
  };

  public inputElement: HTMLInputElement;

  private onFocus = () => {
    this.setState({
      focused: true,
    });
  };

  private onBlur = () => {
    const { focused } = this.state;

    if (this.inputElement.value.length === 0 && focused) {
      this.setState({
        focused: false,
      });
    }
  };

  public render() {
    const { color } = this.props;
    const { focused } = this.state;

    return (
      <Root>
        <Label color={color} focused={focused}>
          Name
        </Label>
        <Input
          innerRef={r => (this.inputElement = r)}
          color={color}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        <Indicator color={color} focused={focused} />
      </Root>
    );
  }
}
