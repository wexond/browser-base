import * as React from 'react';

import colors from '../../defaults/colors';
import { TextfieldType } from '../../enums';

import {
  Root,
  HoverBorder,
  LeadingIcon,
  TrailingIcon,
  Container,
  Label,
  Input,
  Indicator,
  HelperTexts,
  AssistiveText,
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
  activated: boolean;
}

export default class Textfield extends React.Component<IProps, IState> {
  public static defaultProps = {
    color: colors.deepPurple['500'],
    type: TextfieldType.Filled,
  };

  public state: IState = {
    activated: false,
  };

  public inputElement: HTMLInputElement;

  private onClick = () => {
    this.inputElement.focus();
  };

  private onFocus = () => {
    this.setState({
      activated: true,
    });
  };

  private onBlur = () => {
    const { activated } = this.state;

    if (this.inputElement.value.length === 0 && activated) {
      this.setState({
        activated: false,
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
    const { activated } = this.state;

    return (
      <React.Fragment>
        <Root onClick={this.onClick}>
          {leadingIcon && <LeadingIcon src={leadingIcon} />}
          <Container>
            <Label color={color} activated={activated}>
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
          <HoverBorder className="hover-border" />
          <Indicator color={color} activated={activated} />
        </Root>
        <HelperTexts icon={!!leadingIcon}>
          <AssistiveText>Helper text</AssistiveText>
        </HelperTexts>
      </React.Fragment>
    );
  }
}
