import * as React from 'react';

import colors from '../../defaults/colors';
import { TextfieldType } from '../../enums';

import {
  Root, LeadingIcon, TrailingIcon, Container, Label, Input, Indicator,
} from './styles';

export type ClickEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  color?: string;
  label?: string;
  type?: TextfieldType;
  leadingIcon?: string;
  trailingIcon?: string;
  onIconClick?: ClickEvent;
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

  private onClick = () => {
    this.inputElement.focus();
  };

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

  private onTrailingIconClick = (e?: React.SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const { onIconClick } = this.props;

    if (typeof onIconClick === 'function') {
      onIconClick(e);
    }
  };

  public render() {
    const {
      color, label, leadingIcon, trailingIcon, onIconClick,
    } = this.props;
    const { focused } = this.state;

    return (
      <Root onClick={this.onClick}>
        {leadingIcon && <LeadingIcon src={leadingIcon} />}
        <Container>
          <Label color={color} focused={focused}>
            {label}
          </Label>
          <Input
            innerRef={r => (this.inputElement = r)}
            color={color}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
        </Container>
        {trailingIcon && <TrailingIcon src={trailingIcon} onClick={this.onTrailingIconClick} />}
        <Indicator color={color} focused={focused} />
      </Root>
    );
  }
}
