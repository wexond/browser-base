import React from 'react';

import Item from './Item';
import { Root, ForwardIcon } from './styles';
import store from '../../../store';

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
