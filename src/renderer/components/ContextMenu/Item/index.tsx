import * as React from 'react';

import { StyledMenuItem, Title } from './styles';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  onClick?: ButtonEvent;
  onMouseDown?: ButtonEvent;
  visible?: boolean;
  disabled?: boolean;
  dense?: boolean;
}

export default class MenuItem extends React.Component<IProps, {}> {
  public static defaultProps: IProps = {
    visible: true,
  };

  public render() {
    const { visible, disabled, dense, children } = this.props;

    return (
      <StyledMenuItem disabled={disabled} dense={dense} visible={visible}>
        <Title dense={dense} disabled={disabled}>
          {children}
        </Title>
      </StyledMenuItem>
    );
  }
}
