import * as React from 'react';

import store from '@bookmarks/store';
import { Bookmark } from '@/interfaces/';
import { HomeIcon, Root, Title } from './styles';

export interface Props {
  item?: Bookmark;
  home?: boolean;
}

export default class TreeBarItem extends React.Component<Props, {}> {
  public onClick = () => {
    const { item, home } = this.props;
    store.goToFolder(home ? null : item._id);
  };

  public render() {
    const { home, item } = this.props;

    return (
      <Root onClick={this.onClick}>
        {!home && <Title>{item.title}</Title>}
        {home && <HomeIcon />}
      </Root>
    );
  }
}
