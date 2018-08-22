import React from 'react';

import { HomeIcon, Root, Title } from './styles';
import { Bookmark } from '~/interfaces';
import store from '@app/store';

export interface Props {
  item?: Bookmark;
  home?: boolean;
}

export default class TreeBarItem extends React.Component<Props, {}> {
  public onClick = () => {
    const { item, home } = this.props;

    if (home) {
      store.bookmarksStore.goToFolder(null);
    } else {
      store.bookmarksStore.goToFolder(item._id);
    }
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
