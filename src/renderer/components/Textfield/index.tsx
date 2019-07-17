import * as React from 'react';

import { ERROR_COLOR, colors } from '~/renderer/constants';
import { StyledTextfield, Input, Label, Indicator, Icon } from './style';

export type TestFunction = (str: string) => boolean;

interface Props {
  color?: string;
  label?: string;
  placeholder?: string;
  icon?: any;
  onIconClick?: (target: Textfield) => void;
  inputType?: 'text' | 'email' | 'password' | 'number';
  style?: any;
  test?: TestFunction;
}

interface State {
  activated: boolean;
  focused: boolean;
  error: boolean;
}

export class Textfield extends React.PureComponent<Props, State> {
  public inputRef = React.createRef<HTMLInputElement>();

  static defaultProps: Props = {
    color: colors.blue['500'],
    inputType: 'text',
  };

  public state: State = {
    activated: false,
    focused: false,
    error: false,
  };

  public get value() {
    return this.inputRef.current.value;
  }

  public set value(str: string) {
    this.inputRef.current.value = str;
  }

  onClick = () => {
    this.inputRef.current.focus();
  };

  public onFocus = () => {
    this.setState({
      activated: true,
      focused: true,
    });
  };

  public onBlur = () => {
    this.setState({
      activated: this.value.length !== 0,
      focused: false,
    });
  };

  public onIconClick = (e: React.SyntheticEvent<any>) => {
    e.stopPropagation();
    e.preventDefault();

    const { onIconClick } = this.props;

    if (typeof onIconClick === 'function') {
      onIconClick(this);
    }
  };

  public test(fn?: TestFunction) {
    const { test } = this.props;
    if (fn == null && test == null) return true;

    const correct = fn != null ? fn(this.value) : test(this.value);

    this.setState({
      error: !correct,
      focused: !correct,
      activated: this.value.length !== 0 || !correct,
    });

    return correct;
  }

  public onInput = () => {
    this.setState({ error: false });
  };

  public clear() {
    this.value = '';

    this.setState({
      activated: false,
      error: false,
      focused: false,
    });
  }

  render() {
    const { color, label, placeholder, icon, inputType, style } = this.props;
    const { activated, focused, error } = this.state;

    const hasLabel = label != null && label !== '';
    const hasIcon = icon != null && icon !== '';

    const primaryColor = error ? ERROR_COLOR : color;

    return (
      <StyledTextfield
        className="textfield"
        onClick={this.onClick}
        style={style}
      >
        <Input
          ref={this.inputRef}
          type={inputType}
          color={primaryColor}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          hasLabel={hasLabel}
          hasIcon={hasIcon}
          placeholder={label == null || focused ? placeholder : null}
          onInput={this.onInput}
          spellCheck={false}
        />
        {hasLabel && (
          <Label activated={activated} focused={focused} color={primaryColor}>
            {label}
          </Label>
        )}
        {hasIcon && <Icon src={icon} onClick={this.onIconClick} />}
        <Indicator focused={focused} color={primaryColor} />
      </StyledTextfield>
    );
  }
}
