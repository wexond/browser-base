import * as React from 'react';

import { colors } from '../../../defaults/colors';
import { TextfieldType } from '../../../enums';

import { executeEventStopPropagation } from '../../../utils';
import {
  AssistiveText,
  Container,
  HelperTexts,
  HoverBorder,
  Indicator,
  Input,
  InputContainer,
  Label,
  LeadingIcon,
  Root,
  TrailingIcon,
} from './styles';

export type ClickEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;
export type KeyboardEvent = (e?: React.KeyboardEvent<HTMLInputElement>) => void;

export interface IProps {
  color?: string;
  label?: string;
  type?: TextfieldType;
  leadingIcon?: string;
  trailingIcon?: string;
  helperText?: any;
  style?: any;
  onLeadingIconClick?: ClickEvent;
  onTrailingIconClick?: ClickEvent;
  onKeyPress?: KeyboardEvent;
}

export interface IState {
  activated: boolean;
}

export default class Textfield extends React.Component<IProps, IState> {
  public static defaultProps = {
    color: colors.blue['500'],
    type: TextfieldType.Filled,
  };

  public state: IState = {
    activated: false,
  };

  public inputElement: HTMLInputElement;

  public onTrailingIconClick = (e?: React.SyntheticEvent<HTMLDivElement>) => {
    // eslint-disable-next-line React/destructuring-assignment
    executeEventStopPropagation(e, this.props.onTrailingIconClick);
  }

  public getValue = () => this.inputElement.value;

  public setValue = (value: string) => {
    this.inputElement.value = value;
    this.inputElement.focus();
  }

  public render() {
    const {
      color,
      label,
      leadingIcon,
      trailingIcon,
      helperText,
      style,
      onKeyPress,
    } = this.props;
    const { activated } = this.state;

    return (
      <Root onClick={this.onClick} style={style}>
        <Container>
          {leadingIcon && (
            <LeadingIcon
              src={leadingIcon}
              onClick={this.onLeadingIconIconClick}
            />
          )}
          <InputContainer>
            <Label color={color} activated={activated}>
              {label}
            </Label>
            <Input
              innerRef={r => (this.inputElement = r)}
              color={color}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onKeyPress={onKeyPress}
            />
          </InputContainer>
          {trailingIcon && (
            <TrailingIcon
              src={trailingIcon}
              onClick={this.onTrailingIconClick}
            />
          )}
          <HoverBorder className="hover-border" />
          <Indicator color={color} activated={activated} />
        </Container>
        {helperText && (
          <HelperTexts icon={!!leadingIcon}>
            <AssistiveText>{helperText}</AssistiveText>
          </HelperTexts>
        )}
      </Root>
    );
  }

  private onClick = () => {
    this.inputElement.focus();
  }

  private onFocus = () => {
    this.setState({
      activated: true,
    });
  }

  private onBlur = () => {
    const { activated } = this.state;

    if (this.inputElement.value.length === 0 && activated) {
      this.setState({
        activated: false,
      });
    }
  }

  private onLeadingIconIconClick = (
    e?: React.SyntheticEvent<HTMLDivElement>,
  ) => {
    // eslint-disable-next-line React/destructuring-assignment
    executeEventStopPropagation(e, this.props.onLeadingIconClick);
  }
}
