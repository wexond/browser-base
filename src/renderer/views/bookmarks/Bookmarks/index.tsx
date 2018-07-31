import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import Appstore from '../../../../app/store';
import store from '../../store';
import db from '../../../../shared/models/app-database';
import Item from '../Item';
import TreeBar from '../TreeBar';
import { Content, Container, Items } from './styles';

@observer
class Bookmarks extends React.Component {
  public componentDidMount() {
    db.favicons
      .each(favicon => {
        if (Appstore.favicons[favicon.url] == null && favicon.favicon.byteLength !== 0) {
          Appstore.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
        }
      })
      .then(() => {
        this.forceUpdate();
      });

    store.goTo(-1);
  }

  public render() {
    const items = Appstore.bookmarks.filter(x => x.parent === store.currentTree);

    return (
      <React.Fragment>
        <TreeBar />
        <Content>
          <Container>
            {items.length > 0 && (
              <Items>{items.map(data => <Item data={data} key={data.id} />)}</Items>
            )}
          </Container>
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(Bookmarks);
