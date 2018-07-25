import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import AppStore from '../../../../app/store';
import Store from '../../store';
import db from '../../../../shared/models/app-database';
import Item from '../Item';
import TreeBar from '../TreeBar';
import { Content, Container, Items } from './styles';

@observer
class Bookmarks extends React.Component {
  public componentDidMount() {
    db.favicons
      .each(favicon => {
        if (AppStore.favicons[favicon.url] == null && favicon.favicon.byteLength !== 0) {
          AppStore.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
        }
      })
      .then(() => {
        Store.bookmarks = AppStore.bookmarks.filter(x => x.parent === Store.currentTree);
      });

    Store.goTo(-1);
  }

  public render() {
    return (
      <React.Fragment>
        <TreeBar />
        <Content>
          <Container>
            {Store.bookmarks.length > 0 && (
              <Items>{Store.bookmarks.map(data => <Item data={data} key={data.id} />)}</Items>
            )}
          </Container>
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(Bookmarks);
