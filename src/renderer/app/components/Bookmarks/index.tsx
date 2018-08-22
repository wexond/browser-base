import React from 'react';
import { observer } from 'mobx-react';

import store from '@app/store';
import TreeBar from '../TreeBar';
import { Container, Items } from './styles';
import { PageContent } from '../Menu/styles';
import BookmarkItem from '../BookmarkItem';

@observer
export default class Bookmarks extends React.Component {
  public async componentDidMount() {
    store.bookmarksStore.goToFolder(null);
  }

  public render() {
    const items = store.bookmarksStore.bookmarks.filter(
      x => x.parent === store.bookmarksStore.currentTree,
    );

    return (
      <React.Fragment>
        <TreeBar />
        <PageContent>
          <Container>
            {items.length > 0 && (
              <Items>
                {items.map(data => (
                  <BookmarkItem data={data} key={data._id} />
                ))}
              </Items>
            )}
          </Container>
        </PageContent>
      </React.Fragment>
    );
  }
}
