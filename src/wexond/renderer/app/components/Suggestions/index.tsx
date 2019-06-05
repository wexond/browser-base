import { observer } from 'mobx-react';
import * as React from 'react';

import { StyledSuggestions } from './style';
import store from '../../store';
import { SuggestionComponent } from '../Suggestion';

interface Props {
  visible: boolean;
  onSelect?: {(event: React.MouseEvent): void}
}

const onMouseDown = (e: React.MouseEvent) => {
 // e.stopPropagation();
};

export const Suggestions = observer(({ visible, onSelect }: Props) => {
  return (
    <StyledSuggestions visible={visible}
                       onMouseDown={onMouseDown}
    >
      {store.suggestions.list.map(suggestion => (
        <SuggestionComponent
          onSelect={onSelect}
          suggestion={suggestion}
          key={suggestion.id} />
      ))}
    </StyledSuggestions>
  );
});
