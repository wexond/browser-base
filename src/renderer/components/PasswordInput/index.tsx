import * as React from 'react';

import { Textfield, TextFieldProps } from '../Textfield';
import { ICON_INVISIBLE, ICON_VISIBLE } from '~/renderer/constants/icons';

interface Props extends TextFieldProps {
  style?: any;
}

interface State {
  visible: boolean;
}

export class PasswordInput extends React.PureComponent<Props, State> {
  public state: State = {
    visible: false,
  };

  private ref = React.createRef<Textfield>();

  public onIconClick = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  public set value(str: string) {
    this.ref.current.value = str;
  }

  public get value() {
    return this.ref.current.value;
  }

  public test() {
    return this.ref.current.test((str) => str.trim().length !== 0);
  }

  public clear() {
    this.ref.current.clear();
  }

  public render() {
    const { style, dark } = this.props;
    const { visible } = this.state;

    return (
      <Textfield
        ref={this.ref}
        dark={dark}
        label="Password"
        inputType={visible ? 'text' : 'password'}
        icon={visible ? ICON_INVISIBLE : ICON_VISIBLE}
        onIconClick={this.onIconClick}
        style={style}
      />
    );
  }
}
