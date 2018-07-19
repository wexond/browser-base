import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import Store from '../../store';

import FolderModel from '../../models/folder';
import PageModel from '../../models/page';

import Folder from '../Folder';
import Item from '../Item';
import TreeBar from '../TreeBar';
import {
  Content, Folders, Items, SubTitle,
} from './styles';

@observer
class Bookmarks extends React.Component {
  componentDidMount() {
    // Temporary, for testing
    Store.data = new FolderModel(
      '',
      [new PageModel('Wexond', 'https://github.com/wexond/wexond')],
      [
        new FolderModel('A'),
        new FolderModel(
          'B',
          [],
          [new FolderModel('B.A', [], [new FolderModel('B.A.A')]), new FolderModel('B.B', [], [])],
        ),
        new FolderModel('C'),
      ],
      true,
    );

    Store.selected = Store.data;
    Store.updatePath();
  }

  public render() {
    const selected = Store.selected;
    const noItems = selected && selected.items.length === 0;

    return (
      <React.Fragment>
        <TreeBar />
        {selected && (
          <Content>
            {selected.folders.length > 0 && <SubTitle>Folders</SubTitle>}
            <Folders>
              {selected.folders.map((data: any, key: any) => <Folder data={data} key={key} />)}
            </Folders>
            {selected.items.length > 0 && <SubTitle>Items</SubTitle>}
            {!noItems && (
              <Items>
                {selected.items.map((data: any, key: any) => <Item data={data} key={key} />)}
              </Items>
            )}
          </Content>
        )}
      </React.Fragment>
    );
  }
}

export default hot(module)(Bookmarks);
