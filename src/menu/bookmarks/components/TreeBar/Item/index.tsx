import React from 'react';
import Store from '../../../store';

import { Root, Title, HomeIcon } from './styles';

export interface IProps {
  data: any;
  home?: boolean;
}

export default class Item extends React.Component<IProps, {}> {
  public static defaultProps = {
    home: false,
  };

  onClick = () => {
    const { data } = this.props;

    Store.selected = data;
    Store.updatePath();
  };

  public render() {
    const { home, data } = this.props;

    return (
      <Root onClick={this.onClick}>
        {!home && <Title>{data.title}</Title>}
        {home && <HomeIcon />}
      </Root>
    );
  }
}
