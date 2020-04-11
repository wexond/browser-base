import * as React from 'react';

import { ERROR_COLOR, BLUE_500 } from '~/renderer/constants';
import { StyledTextfield, Input, Label, Indicator, Icon } from './style';

export type TestFunction = (str: string) => boolean;

export interface TextFieldProps {
  color?: string;
  label?: string;
  placeholder?: string;
  icon?: string;
  onIconClick?: (target: Textfield) => void;
  inputType?: 'text' | 'email' | 'password' | 'number';
  style?: any;
  test?: TestFunction;
  width?: number;
  onChange?: (value: string) => void;
  delay?: number;
  dark?: boolean;
}

interface State {
  activated: boolean;
  focused: boolean;
  error: boolean;
  value: string;
}

export class Textfield extends React.PureComponent<TextFieldProps, State> {
  public inputRef = React.createRef<HTMLInputElement>();
  private timer: number;

  private static defaultProps: TextFieldProps = {
    color: BLUE_500,
    inputType: 'text',
    width: 280,
    delay: 200,
  };

  public state: State = {
    activated: false,
    focused: false,
    error: false,
    value: undefined,
  };

  public get value() {
    return this.inputRef.current.value;
  }

  public set value(str: string) {
    this.inputRef.current.value = str;

    this.setState({
      activated: !!str.length,
      value: str,
    });
  }

  private onClick = () => {
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

  public onIconClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
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
    clearTimeout(this.timer);
    const { onChange } = this.props;

    this.setState({ error: false, value: this.inputRef.current.value });
    if (onChange) {
      onChange(this.inputRef.current.value);
    }
  };

  public clear() {
    this.value = '';

    this.setState({
      activated: false,
      error: false,
      focused: false,
    });
  }

  public render() {
    const {
      color,
      label,
      placeholder,
      icon,
      inputType,
      style,
      width,
      dark,
    } = this.props;
    const { activated, focused, error, value } = this.state;

    const hasLabel = label != null && label !== '';
    const hasIcon = icon != null && icon !== '';

    const primaryColor = error ? ERROR_COLOR : color;

    return (
      <StyledTextfield
        className="textfield"
        onClick={this.onClick}
        style={style}
        dark={dark}
        width={width || Textfield.defaultProps.width}
      >
        <Input
          dark={dark}
          ref={this.inputRef}
          type={inputType || Textfield.defaultProps.inputType}
          color={primaryColor}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          hasLabel={hasLabel}
          hasIcon={hasIcon}
          placeholder={label == null || focused ? placeholder : null}
          onInput={this.onInput}
          spellCheck={false}
          value={value}
        />
        {hasLabel && (
          <Label
            dark={dark}
            activated={activated}
            focused={focused}
            color={primaryColor}
          >
            {label}
          </Label>
        )}
        {hasIcon && <Icon dark={dark} src={icon} onClick={this.onIconClick} />}
        <Indicator focused={focused} color={primaryColor} />
      </StyledTextfield>
    );
  }
}
