import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { StyledSuggestions } from './style';
import { Suggestion } from '../Suggestion';
import store from '../../store';

interface Props {
  visible: boolean;
}

const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

export const Suggestions = observer(({ visible }: Props) => {
  return (
    <StyledSuggestions visible={visible} onMouseDown={onMouseDown}>
      {store.suggestions.list.map((suggestion) => (
        <Suggestion suggestion={suggestion} key={suggestion.id} />
      ))}
    </StyledSuggestions>
  );
});
