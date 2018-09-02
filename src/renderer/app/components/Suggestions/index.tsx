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

    let vis = visible;

    if (suggestions.length === 0) {
      vis = false;
    }

    let height = 0;

    suggestions.forEach(a => {
      height += 40;
    });

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
        {suggestions.map(suggestion => (
          <Suggestion suggestion={suggestion} key={suggestion.id} />
        ))}
      </StyledSuggestions>
    );
  }
}
