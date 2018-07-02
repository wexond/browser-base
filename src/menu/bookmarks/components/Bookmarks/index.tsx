import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';

import Folder from '../Folder';
import Item from '../Item';
import { Content, Folders, Items } from './styles';

@observer
class Bookmarks extends React.Component {
  public render() {
    const testData = {
      title: 'wexond/wexond: An extensible web browser with Material UI and built-in ad blocker.',
      url: 'https://www.github.com/Wexond/Wexond',
      selected: false,
    };

    return (
      <Content>
        <Folders>
          <Folder />
          <Folder />
        </Folders>
        <Items>
          <Item data={testData} />
          <Item data={testData} />
          <Item data={testData} />
          <Item data={testData} />
        </Items>
      </Content>
    );
  }
}

export default hot(module)(Bookmarks);
