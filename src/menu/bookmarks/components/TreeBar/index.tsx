import React from 'react';
import Store from '../../store';

import Item from './Item';
import { Root } from './styles';

export default class TreeBar extends React.Component {
  public render() {
    return (
      <Root>
        <Item data={Store.data} home />
        {Store.path.map((data: any, key: any) => <Item data={data} key={key} />)}
      </Root>
    );
  }
}
