import React from 'react';
import Store from '../../store';

import Item from './Item';
import { Root, ForwardIcon } from './styles';

export default class TreeBar extends React.Component {
  public render() {
    return (
      <Root>
        <Item home />
        {Store.path.map((data: any) => (
          <React.Fragment key={data.id}>
            <ForwardIcon className="FORWARD-ICON" />
            <Item item={data} />
          </React.Fragment>
        ))}
      </Root>
    );
  }
}
