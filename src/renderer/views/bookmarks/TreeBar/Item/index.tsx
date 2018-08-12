import React from 'react';

import { BookmarkItem } from '../../../../../interfaces';
import store from '../../../../store';
import { HomeIcon, Root, Title } from './styles';

export interface Props {
  item?: BookmarkItem;
  home?: boolean;
}

export default class Item extends React.Component<Props, {}> {
  public onClick = () => {
    const { item, home } = this.props;

    if (home) {
      store.goToBookmarkFolder(-1);
    } else {
      store.goToBookmarkFolder(item.id);
    }
  }

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
