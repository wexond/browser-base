import { observer } from 'mobx-react';
import React from 'react';

import { Root } from './styles';
import NavigationDrawerItem from '../NavigationDrawerItem';

interface Props {
  children?: any;
}

interface State {
  selectedItem: number;
}

@observer
export default class extends React.Component<Props, State> {
  public state: State = {
    selectedItem: 0,
  };

  public static Item = NavigationDrawerItem;

  private onItemClick = (
    e: React.MouseEvent<HTMLDivElement>,
    item: NavigationDrawerItem,
  ) => {
    if (item) {
      this.setState({ selectedItem: item.props.id });
    }
  };

  public render() {
    const { children } = this.props;

    let id = -1;

    return (
      <Root>
        {React.Children.map(children, (el: React.ReactElement<any>) => {
          if (el.props.title) {
            id++;

            return React.cloneElement(el, {
              id,
              onClick: this.onItemClick,
              selected: id === this.state.selectedItem,
            });
          }

          return null;
        })}
      </Root>
    );
  }
}
