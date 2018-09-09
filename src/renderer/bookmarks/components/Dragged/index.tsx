import { observer } from 'mobx-react';
import React from 'react';

import store from '@bookmarks/store';
import { Root, Icon, Title } from './styles';

@observer
export default class extends React.Component {
  public render() {
    const dragged = store.dragged;
    const pos = store.mousePos;

    const style = pos && {
      left: pos.x,
      top: pos.y,
    };

    return (
      <Root style={style}>
        <Icon src={dragged && dragged.favicon} />
        <Title>{dragged && dragged.title}</Title>
      </Root>
    );
  }
}
