import { observer } from 'mobx-react';
import React from 'react';

import Suggestion from '../Suggestion';
import store from '@app/store';
import { StyledSuggestions } from './styles';

@observer
export default class Suggestions extends React.Component {
  private suggestions: HTMLDivElement;

  public render() {
    const visible = store.addressBarStore.toggled;
    const { suggestions } = store.suggestionsStore;
    const { bookmarks } = store.bookmarksStore;

    let vis = visible;

    if (suggestions.length === 0 && bookmarks.length === 0) {
      vis = false;
    }

    return (
      <StyledSuggestions
        innerRef={r => (this.suggestions = r)}
        style={{
          opacity: vis ? 1 : 0,
          pointerEvents: !vis ? 'none' : 'auto',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {suggestions.map(suggestion => (
          <Suggestion suggestion={suggestion} key={suggestion.id} />
        ))}
        {bookmarks.map(bookmark => (
          <BookmarkTile />
        ))}
      </StyledSuggestions>
    );
  }
}
