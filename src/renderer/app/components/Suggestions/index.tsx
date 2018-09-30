import { observer } from 'mobx-react';
import React from 'react';

import Suggestion from '../Suggestion';
import store from '@app/store';
import { StyledSuggestions, Dial } from './styles';
import BookmarkTile from '@app/components/BookmarkTile';

interface Props {
  visible: boolean;
}

@observer
export default class Suggestions extends React.Component<Props> {
  private suggestions: HTMLDivElement;

  public render() {
    const { visible } = this.props;
    const { suggestions } = store.suggestionsStore;
    const { bookmarks } = store.bookmarksStore;

    return (
      <StyledSuggestions
        innerRef={r => (this.suggestions = r)}
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: !visible ? 'none' : 'auto',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {suggestions.map(suggestion => (
          <Suggestion suggestion={suggestion} key={suggestion.id} />
        ))}
        <Dial visible={suggestions.length === 0}>
          {bookmarks.map(bookmark => (
            <BookmarkTile key={bookmark._id} data={bookmark} />
          ))}
        </Dial>
      </StyledSuggestions>
    );
  }
}
