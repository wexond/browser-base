import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';

import Folder from '../Folder';
import { Content, Folders } from './styles';

@observer
class Bookmarks extends React.Component {
  public render() {
    return (
      <Content>
        <Folders>
          <Folder />
          <Folder />
        </Folders>
      </Content>
    );
  }
}

export default hot(module)(Bookmarks);
