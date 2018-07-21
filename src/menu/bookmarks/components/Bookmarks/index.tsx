import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import Store from '../../store';

import Item from '../Item';
import TreeBar from '../TreeBar';
import { Content, Items } from './styles';

@observer
class Bookmarks extends React.Component {
  componentDidMount() {
    // Temporary, for testing
    Store.bookmarks = [
      {
        title: 'Folder 1',
        type: 'folder',
        id: 0,
        parent: -1,
      },
      {
        title: 'Subfolder 1',
        type: 'folder',
        id: 1,
        parent: 0,
      },
      {
        title: 'Wexond',
        type: 'item',
        url: 'https://github.com/wexond/wexond',
        id: 2,
        parent: -1,
      },
      {
        title: 'Nersent',
        type: 'item',
        url: 'https://github.com/nersent',
        id: 3,
        parent: 1,
      },
    ];

    Store.goTo(-1);
  }

  public render() {
    return (
      <React.Fragment>
        <TreeBar />
        <Content>
          <Items>
            {Store.bookmarks.map(data => {
              if (data.parent === Store.currentTree) {
                return <Item data={data} key={data.id} />;
              }
              return null;
            })}
          </Items>
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(Bookmarks);
