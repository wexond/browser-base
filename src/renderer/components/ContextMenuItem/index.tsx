import * as React from 'react';

import { StyledMenuItem, Title } from './styles';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  onClick?: ButtonEvent;
  onMouseDown?: ButtonEvent;
  visible?: boolean;
  disabled?: boolean;
}

export default class MenuItem extends React.Component<IProps, {}> {
  public static defaultProps: IProps = {
    visible: true,
  };

  public render() {
    const { visible, disabled, children, onClick } = this.props;

    return (
      <StyledMenuItem onClick={onClick} disabled={disabled} visible={visible}>
        <Title disabled={disabled}>{children}</Title>
      </StyledMenuItem>
    );
  }
}
