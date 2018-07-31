import React from 'react';
import Store from '../../../store';

import { Root, Title, HomeIcon } from './styles';
import BookmarkItem from '../../../../../shared/models/bookmark-item';

export interface Props {
  item?: BookmarkItem;
  home?: boolean;
}

export default class Item extends React.Component<Props, {}> {
  onClick = () => {
    const { item, home } = this.props;

    if (home) {
      Store.goTo(-1);
    } else {
      Store.goTo(item.id);
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
