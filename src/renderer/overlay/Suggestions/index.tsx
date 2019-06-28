import { observer } from 'mobx-react';
import * as React from 'react';

import { StyledSuggestions } from './style';
import store from '../../app/store';
import { SuggestionComponent } from '../../../app/components/Suggestion';

interface Props {
  visible: boolean;
}

const onMouseDown = (e: React.MouseEvent) => {
  e.stopPropagation();
};

export const Suggestions = observer(({ visible }: Props) => {
  return (
    <StyledSuggestions visible={visible} onMouseDown={onMouseDown}>
      {store.suggestions.list.map(suggestion => (
        <SuggestionComponent suggestion={suggestion} key={suggestion.id} />
      ))}
    </StyledSuggestions>
  );
});
