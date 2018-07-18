import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import Store from '../../store';

import Folder from '../Folder';
import Item from '../Item';
import { Content, Folders, Items } from './styles';

@observer
class Bookmarks extends React.Component {
  public componentDidMount() {
    Store.data = {
      folders: [
        {
          title: 'Folder',
          folders: [
            {
              title: 'Subfolder',
              folders: [],
              items: [
                {
                  title: 'YouTube',
                  url: 'https://www.youtube.com',
                },
              ],
            },
          ],
          items: [
            {
              title: 'Facebook',
              url: 'https://www.facebook.com',
            },
          ],
        },
      ],
      items: [
        {
          title:
            'wexond/wexond: An extensible web browser with Material UI and built-in ad blocker.',
          url: 'https://www.github.com/Wexond/Wexond',
        },
      ],
    };

    Store.selected = Store.data;
  }

  public render() {
    const selected = Store.selected;

    return (
      <Content>
        {selected != null && (
          <React.Fragment>
            <Folders>
              {selected.folders.map((data: any, key: any) => <Folder data={data} key={key} />)}
            </Folders>
            <Items>
              {selected.items.map((data: any, key: any) => <Item data={data} key={key} />)}
            </Items>
          </React.Fragment>
        )}
      </Content>
    );
  }
}

export default hot(module)(Bookmarks);
