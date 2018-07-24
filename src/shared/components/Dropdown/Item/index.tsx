import * as React from 'react';

import { Root } from './styles';

export type SEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  onClick?: SEvent;
  onMouseDown?: SEvent;
}

export default class Item extends React.Component<IProps, {}> {
  public static defaultProps = {};

  public render() {
    const { children, onClick, onMouseDown } = this.props;

    return (
      <Root onClick={onClick} onMouseDown={onMouseDown}>
        {children}
      </Root>
    );
  }
}
