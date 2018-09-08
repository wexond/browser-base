import React from 'react';
import { StyledBookmarksBar } from './styles';
import store from '@app/store';
import BookmarkItem from '@app/components/BookmarkItem';
import { observer } from 'mobx-react';

@observer
export default class BookmarksBar extends React.Component {
  public render() {
    return (
      <StyledBookmarksBar>
        {store.bookmarksStore.bookmarks.map(item => {
          if (item.parent == null) {
            return <BookmarkItem item={item} key={item._id} />;
          }
          return null;
        })}
      </StyledBookmarksBar>
    );
  }
}
