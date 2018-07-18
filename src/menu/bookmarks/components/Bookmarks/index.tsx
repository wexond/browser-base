import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import Store from '../../store';

import Folder from '../Folder';
import Item from '../Item';
import TreeBar from '../TreeBar';
import { Content, Folders, Items } from './styles';

import { getFolderPath } from '../../utils/bookmarks';

@observer
class Bookmarks extends React.Component {
  componentDidMount() {
    Store.data = {
      folders: [
        {
          title: 'A',
          folders: [],
          items: [],
        },
        {
          title: 'B',
          folders: [
            {
              title: 'B.A',
              folders: [
                {
                  title: 'B.A.A',
                  folders: [],
                  items: [],
                },
              ],
              items: [],
            },
          ],
          items: [],
        },
      ],
      items: [],
    };

    Store.selected = Store.data.folders[1].folders[0].folders[0];
    Store.updatePath();
  }

  public render() {
    const selected = Store.selected;

    return (
      <React.Fragment>
        <TreeBar />
        {selected != null && (
          <Content>
            <Folders>
              {selected.folders.map((data: any, key: any) => <Folder data={data} key={key} />)}
            </Folders>
            <Items>
              {selected.items.map((data: any, key: any) => <Item data={data} key={key} />)}
            </Items>
          </Content>
        )}
      </React.Fragment>
    );
  }
}

export default hot(module)(Bookmarks);
