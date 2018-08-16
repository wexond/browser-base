import React from 'react';
import { observer } from 'mobx-react';

import store from '../../../store';
import Item from '../Item';
import TreeBar from '../TreeBar';
import { Container, Items } from './styles';
import { PageContent } from '../../app/Menu/styles';

@observer
export default class Bookmarks extends React.Component {
  public async componentDidMount() {
    store.goToBookmarkFolder(-1);
  }

  public render() {
    const items = store.bookmarks.filter(
      x => x.parent === store.currentBookmarksTree,
    );

    return (
      <React.Fragment>
        <TreeBar />
        <PageContent>
          <Container>
            {items.length > 0 && (
              <Items>
                {items.map(data => (
                  <Item data={data} key={data.id} />
                ))}
              </Items>
            )}
          </Container>
        </PageContent>
      </React.Fragment>
    );
  }
}
