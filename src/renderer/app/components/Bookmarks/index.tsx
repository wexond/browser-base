import React from 'react';
import { observer } from 'mobx-react';

import store from '@app/store';
import TreeBar from '../TreeBar';
import { Container, Items } from './styles';
import { PageContent } from '../Menu/styles';
import BookmarkItem from '../BookmarkItem';

@observer
export default class Bookmarks extends React.Component {
  private cmdPressed = false;

  public async componentDidMount() {
    store.bookmarksStore.goToFolder(null);

    window.addEventListener('keydown', e => {
      this.cmdPressed = e.key === 'Meta'; // Command on macOS
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'Meta') {
        this.cmdPressed = false;
      }
    });
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
                  <BookmarkItem cmdPressed={this.cmdPressed} data={data} key={data._id} />
                ))}
              </Items>
            )}
          </Container>
        </PageContent>
      </React.Fragment>
    );
  }
}
