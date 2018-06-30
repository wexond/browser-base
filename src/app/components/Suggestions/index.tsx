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
  private suggestions: HTMLDivElement;

  public render() {
    const { list } = Store.suggestions;
    const { visible } = this.props;
    const dictionary = Store.dictionary.suggestions;

    const mostVisited = list.filter(x => x.type === 'most-visited');
    const history = list.filter(x => x.type === 'history');
    const bookmarks = list.filter(x => x.type === 'bookmarks');
    const search = list.filter(x => x.type === 'search');
    const noSubheader = list.filter(x => x.type.startsWith('no-subheader'));

    let vis = visible;

    if (!Store.suggestions.getVisible()) vis = false;

    let height = 0;

    list.forEach(a => {
      height += 40;
    });

    if (mostVisited.length > 0) {
      height += 42;
    }

    if (bookmarks.length > 0) {
      height += 42;
    }

    if (history.length > 0) {
      height += 42;
    }

    if (search.length > 0) {
      height += 42;
    }

    return (
      <StyledSuggestions
        innerRef={r => (this.suggestions = r)}
        style={{
          opacity: vis ? 1 : 0,
          pointerEvents: !vis ? 'none' : 'auto',
          height,
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {noSubheader.map(suggestion => <Suggestion suggestion={suggestion} key={suggestion.id} />)}

        {mostVisited.length > 0 && <Caption>{dictionary.mostVisited}</Caption>}
        {mostVisited.map(suggestion => <Suggestion suggestion={suggestion} key={suggestion.id} />)}

        {bookmarks.length > 0 && <Caption>{dictionary.bookmarks}</Caption>}
        {bookmarks.map(suggestion => <Suggestion suggestion={suggestion} key={suggestion.id} />)}

        {history.length > 0 && <Caption>{dictionary.history}</Caption>}
        {history.map(suggestion => <Suggestion suggestion={suggestion} key={suggestion.id} />)}

        {search.length > 0 && <Caption>{dictionary.googleSuggestions}</Caption>}
        {search.map(suggestion => <Suggestion suggestion={suggestion} key={suggestion.id} />)}
      </StyledSuggestions>
    );
  }
}
