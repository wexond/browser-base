import * as React from 'react';

import { Root, Selected, Icon } from './styles';

export interface IProps {}

export default class Button extends React.Component<IProps, {}> {
  public static defaultProps = {};

  public render() {
    return (
      <Root>
        <Selected>Item 2</Selected>
        <Icon />
      </Root>
    );
  }
}
