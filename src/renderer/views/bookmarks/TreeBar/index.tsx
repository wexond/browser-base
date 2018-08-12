import React from 'react';

import store from '../../../store';
import Item from './Item';
import { ForwardIcon, Root } from './styles';

export default class TreeBar extends React.Component {
  public render() {
    return (
      <Root>
        <Item home />
        {store.bookmarksPath.map((data: any) => (
          <React.Fragment key={data.id}>
            <ForwardIcon className="FORWARD-ICON" />
            <Item item={data} />
          </React.Fragment>
        ))}
      </Root>
    );
  }
}
