import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import Store from '../../store';
import db from '../../../../shared/models/app-database';
import Item from '../Item';
import TreeBar from '../TreeBar';
import { Content, Items } from './styles';

@observer
class Bookmarks extends React.Component {
  componentDidMount() {
    this.loadBookmarks();
  }

  loadBookmarks = async () => {
    const bookmarks = await db.bookmarks.toArray();

    Store.bookmarks = bookmarks;
    Store.goTo(-1);
  };

  public render() {
    return (
      <React.Fragment>
        <TreeBar />
        <Content>
          {Store.bookmarks.length > 0 && (
            <Items>
              {Store.bookmarks.map(data => {
                if (data.parent === Store.currentTree) {
                  return <Item data={data} key={data.id} />;
                }
                return null;
              })}
            </Items>
          )}
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(Bookmarks);
