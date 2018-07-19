import React from 'react';
import Store from '../../../store';

import { Root, Icon, HomeIcon } from './styles';

export interface IProps {
  data: any;
  home?: boolean;
}

export interface IState {
  hovered: boolean;
}

export default class Item extends React.Component<IProps, IState> {
  public static defaultProps = {
    home: false,
  };

  public state: IState = {
    hovered: false,
  };

  onMouseEnter = () => this.setState({ hovered: true });

  onMouseLeave = () => this.setState({ hovered: false });

  onClick = () => {
    const { data } = this.props;

    Store.selected = data;
    Store.updatePath();
  };

  public render() {
    const { home, data } = this.props;
    const { hovered } = this.state;

    return (
      <Root
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
        hovered={hovered}
      >
        {!home && data.title}
        {home && <HomeIcon hovered={hovered} />}
        <Icon className="icon" hovered={hovered} />
      </Root>
    );
  }
}
