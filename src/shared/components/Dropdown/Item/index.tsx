import * as React from 'react';

import { Root } from './styles';

export interface IProps {}
export default class Item extends React.Component<IProps, {}> {
  public static defaultProps = {};

  public render() {
    const { children } = this.props;

    return <Root>{children}</Root>;
  }
}
