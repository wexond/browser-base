import React from 'react';

import { Root, Title, HomeIcon } from './styles';
import store from '../../../../store';
import { BookmarkItem } from '../../../../../interfaces';

export interface Props {
  item?: BookmarkItem;
  home?: boolean;
}

export default class Item extends React.Component<Props, {}> {
  onClick = () => {
    const { item, home } = this.props;

    if (home) {
      store.goToBookmarkFolder(-1);
    } else {
      store.goToBookmarkFolder(item.id);
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
