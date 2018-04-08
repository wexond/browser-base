import { observer } from 'mobx-react';
import React from 'react';
import { Caption, StyledSuggestions } from './styles';
import Store from '../../store';
import Suggestion from '../Suggestion';

@observer
export default class Suggestions extends React.Component {
  public render() {
    const { list } = Store.suggestions;
    const mostVisited = list.filter(x => x.type === 'most-visited');
    const history = list.filter(x => x.type === 'history');
    const bookmarks = list.filter(x => x.type === 'bookmarks');
    const search = list.filter(x => x.type === 'search');

    return (
      <StyledSuggestions
        style={{ ...Store.theme.theme.suggestions.style }}
        onMouseDown={e => e.stopPropagation()}
      >
        {mostVisited.length > 0 && <Caption>Most visited</Caption>}
        {mostVisited.map(suggestion => <Suggestion suggestion={suggestion} key={suggestion.id} />)}

        {bookmarks.length > 0 && <Caption>Bookmarks</Caption>}
        {bookmarks.map(suggestion => <Suggestion suggestion={suggestion} key={suggestion.id} />)}

        {history.length > 0 && <Caption>History</Caption>}
        {history.map(suggestion => <Suggestion suggestion={suggestion} key={suggestion.id} />)}

        {search.length > 0 && <Caption>Google suggestions</Caption>}
        {search.map(suggestion => <Suggestion suggestion={suggestion} key={suggestion.id} />)}
      </StyledSuggestions>
    );
  }
}
