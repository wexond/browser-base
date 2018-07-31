import { observer } from 'mobx-react';
import React from 'react';
import { Caption, StyledSuggestions } from './styles';
import Suggestion from '../Suggestion';
import store from '../../../store';

interface Props {
  visible: boolean;
}

@observer
export default class Suggestions extends React.Component<Props, {}> {
  private suggestions: HTMLDivElement;

  public render() {
    const { visible } = this.props;
    const dictionary = store.dictionary.suggestions;

    const mostVisited = store.suggestions.filter(x => x.type === 'most-visited');
    const history = store.suggestions.filter(x => x.type === 'history');
    const bookmarks = store.suggestions.filter(x => x.type === 'bookmarks');
    const search = store.suggestions.filter(x => x.type === 'search');
    const noSubheader = store.suggestions.filter(x => x.type.startsWith('no-subheader'));

    let vis = visible;

    if (store.suggestions.length === 0) vis = false;

    let height = 0;

    store.suggestions.forEach(a => {
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
        {noSubheader.map(suggestion => (
          <Suggestion suggestion={suggestion} key={suggestion.id} />
        ))}

        {mostVisited.length > 0 && <Caption>{dictionary.mostVisited}</Caption>}
        {mostVisited.map(suggestion => (
          <Suggestion suggestion={suggestion} key={suggestion.id} />
        ))}

        {bookmarks.length > 0 && <Caption>{dictionary.bookmarks}</Caption>}
        {bookmarks.map(suggestion => (
          <Suggestion suggestion={suggestion} key={suggestion.id} />
        ))}

        {history.length > 0 && <Caption>{dictionary.history}</Caption>}
        {history.map(suggestion => (
          <Suggestion suggestion={suggestion} key={suggestion.id} />
        ))}

        {search.length > 0 && <Caption>{dictionary.googleSuggestions}</Caption>}
        {search.map(suggestion => (
          <Suggestion suggestion={suggestion} key={suggestion.id} />
        ))}
      </StyledSuggestions>
    );
  }
}
