import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import Store from '../../store';

import Folder from '../Folder';
import Item from '../Item';
import { Content, Folders, Items } from './styles';

@observer
class Bookmarks extends React.Component {
  public render() {
    const folders = Store.data.folders;
    const items = Store.data.items;

    return (
      <Content>
        <Folders>{folders.map((data: any, key: any) => <Folder data={data} key={key} />)}</Folders>
        <Items>{items.map((data: any, key: any) => <Item data={data} key={key} />)}</Items>
      </Content>
    );
  }
}

export default hot(module)(Bookmarks);
