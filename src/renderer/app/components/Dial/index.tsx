import React from 'react';
import { observer } from 'mobx-react';
import store from '@app/store';
import { StyledDial } from './styles';
import BookmarkTile from '@app/components/BookmarkTile';

@observer
export default class Dial extends React.Component {
  public render() {
    const { bookmarks } = store.bookmarksStore;

    return (
      <StyledDial visible={store.suggestionsStore.suggestions.length === 0}>
        {bookmarks.map(bookmark => (
          <BookmarkTile key={bookmark._id} data={bookmark} />
        ))}
      </StyledDial>
    );
  }
}
