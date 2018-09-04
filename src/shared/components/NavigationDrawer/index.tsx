import { observer } from 'mobx-react';
import React from 'react';

import NavigationDrawerItem from '../NavigationDrawerItem';
import { Root, Header, Search, SearchIcon, Input, Title } from './styles';

interface Props {
  title?: string;
  search?: boolean;
  children?: any;
  onSearch?: (str?: string) => void;
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

  public input: HTMLInputElement;

  private typingTimer: any;

  private onItemClick = (
    e: React.MouseEvent<HTMLDivElement>,
    item: NavigationDrawerItem,
  ) => {
    if (item) {
      this.setState({ selectedItem: item.props.id });
    }
  };

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { onSearch } = this.props;
    if (typeof onSearch !== 'function') return;

    clearTimeout(this.typingTimer);

    if (e.key === 'Enter') {
      onSearch(this.input.value);
    } else {
      this.typingTimer = setTimeout(() => {
        onSearch(this.input.value);
      }, 500);
    }
  };

  private onBlur = () => {
    const { onSearch } = this.props;
    if (typeof onSearch !== 'function') return;

    onSearch(this.input.value);
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
                <Input
                  innerRef={r => (this.input = r)}
                  placeholder="Search"
                  onKeyDown={this.onKeyDown}
                  onBlur={this.onBlur}
                />
              </Search>
            )) ||
              (title != null && <Title>{title}</Title>)}
          </Header>
        )}

        {React.Children.map(children, (el: React.ReactElement<any>) => {
          if (el && el.props.title && el.props.visible) {
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
