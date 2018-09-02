import { observer } from 'mobx-react';
import React from 'react';

import NavigationDrawerItem from '../NavigationDrawerItem';
import { Root, Header, Search, SearchIcon, Input, Title } from './styles';

interface Props {
  title?: string;
  search?: boolean;
  children?: any;
}

interface State {
  selectedItem: number;
}

@observer
export default class extends React.Component<Props, State> {
  public state: State = {
    selectedItem: -1,
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

  private onInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // store.menuStore.searchText = e.currentTarget.value;
  };

  public render() {
    const { selectedItem } = this.state;
    const { title, search, children } = this.props;

    let id = -1;

    return (
      <Root>
        {(title != null || search) && (
          <Header>
            {(search && (
              <Search>
                <SearchIcon />
                <Input placeholder="Search" onInput={this.onInput} />
              </Search>
            )) ||
              (title != null && <Title>{title}</Title>)}
          </Header>
        )}

        {React.Children.map(children, (el: React.ReactElement<any>) => {
          if (el.props.title) {
            id++;

            return React.cloneElement(el, {
              id,
              onClick: this.onItemClick,
              selected: id === selectedItem,
            });
          }

          return null;
        })}
      </Root>
    );
  }
}
