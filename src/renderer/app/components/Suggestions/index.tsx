import { observer } from 'mobx-react';
import React from 'react';

import Suggestion from '../Suggestion';
import store from '@app/store';
import { StyledSuggestions } from './styles';

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
        visible={visible}
        onMouseDown={e => e.stopPropagation()}
      >
        {suggestions.map(suggestion => (
          <Suggestion suggestion={suggestion} key={suggestion.id} />
        ))}
      </StyledSuggestions>
    );
  }
}
