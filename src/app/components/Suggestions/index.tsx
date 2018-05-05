import { observer } from 'mobx-react';
import React from 'react';
import { Caption, StyledSuggestions } from './styles';
import Store from '../../store';
import Suggestion from '../Suggestion';

interface Props {
  visible: boolean;
}

@observer
export default class Suggestions extends React.Component<Props, {}> {
  public render() {
    const { list } = Store.suggestions;
    const { visible } = this.props;

    const mostVisited = list.filter(x => x.type === 'most-visited');
    const history = list.filter(x => x.type === 'history');
    const bookmarks = list.filter(x => x.type === 'bookmarks');
    const search = list.filter(x => x.type === 'search');
    const noSubheader = list.filter(x => x.type.startsWith('no-subheader'));

    let vis = visible;

    if (!Store.suggestions.getVisible()) vis = false;

    return (
      <StyledSuggestions
        style={{
          ...Store.theme.theme.suggestions.style,
          display: vis ? 'block' : 'none',
          pointerEvents: !vis ? 'none' : 'auto',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {noSubheader.length > 0 && <div style={{ height: 8 }} />}
        {noSubheader.map(suggestion => <Suggestion suggestion={suggestion} key={suggestion.id} />)}

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
