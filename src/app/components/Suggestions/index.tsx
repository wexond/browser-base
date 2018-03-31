import { observer } from 'mobx-react';
import React from 'react';
import { Caption, StyledSuggestions } from './styles';
import Store from '../../store';
import Suggestion from '../Suggestion';

export default observer(() => (
  <StyledSuggestions onMouseDown={e => e.stopPropagation()}>
    {Store.suggestions.mostVisited.length > 0 && <Caption>Most visited</Caption>}
    {Store.suggestions.mostVisited.map(suggestion => (
      <Suggestion suggestion={suggestion} key={suggestion.id} />
    ))}

    {Store.suggestions.bookmarks.length > 0 && <Caption>Bookmarks</Caption>}
    {Store.suggestions.bookmarks.map(suggestion => (
      <Suggestion suggestion={suggestion} key={suggestion.id} />
    ))}

    {Store.suggestions.history.length > 0 && <Caption>History</Caption>}
    {Store.suggestions.history.map(suggestion => (
      <Suggestion suggestion={suggestion} key={suggestion.id} />
    ))}

    {Store.suggestions.search.length > 0 && <Caption>Google suggestions</Caption>}
    {Store.suggestions.search.map(suggestion => (
      <Suggestion suggestion={suggestion} key={suggestion.id} />
    ))}
  </StyledSuggestions>
));
