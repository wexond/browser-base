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

    let vis = visible;

    if (store.suggestions.length === 0) vis = false;

    let height = 0;

    store.suggestions.forEach(a => {
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
        {store.suggestions.map(suggestion => (
          <Suggestion suggestion={suggestion} key={suggestion.id} />
        ))}
      </StyledSuggestions>
    );
  }
}
