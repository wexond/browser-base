import { observer } from 'mobx-react';
import React from 'react';

import Suggestion from '../Suggestion';
import store from '@app/store';
import { StyledSuggestions } from './styles';
import Dial from '@app/components/Dial';

interface Props {
  visible: boolean;
}

@observer
export default class Suggestions extends React.Component<Props> {
  private suggestions: HTMLDivElement;

  public render() {
    const { visible } = this.props;
    const { suggestions } = store.suggestionsStore;

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

        <Dial />
      </StyledSuggestions>
    );
  }
}
