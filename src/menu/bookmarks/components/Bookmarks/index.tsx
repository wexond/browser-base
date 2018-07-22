import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import AppStore from '../../../../app/store';
import Store from '../../store';
import db from '../../../../shared/models/app-database';
import Item from '../Item';
import TreeBar from '../TreeBar';
import { Content, Items } from './styles';

@observer
class Bookmarks extends React.Component {
  public componentDidMount() {
    this.loadBookmarks();
  }

  public loadBookmarks = async () => {
    const bookmarks = await db.bookmarks.toArray();

    db.favicons.each(favicon => {
      if (AppStore.favicons[favicon.url] == null && favicon.favicon.byteLength !== 0) {
        AppStore.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
      }
    });

    Store.bookmarks = bookmarks;
    Store.goTo(-1);
  };

  public render() {
    const items = Store.bookmarks.filter(r => r.parent === Store.currentTree);

    return (
      <React.Fragment>
        <TreeBar />
        <Content>
          {items.length > 0 && (
            <Items>
              {items.map(data => <Item data={data} key={data.id} />)}
            </Items>
          )}
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(Bookmarks);
