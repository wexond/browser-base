import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { StyledSuggestions, Subheading } from './style';
import store from '../../store';
import { Suggestion } from '../Suggestion';

interface Props {
  visible: boolean;
}

const onMouseDown = (e: React.MouseEvent) => {
  e.stopPropagation();
};

export const Suggestions = observer(({ visible }: Props) => {
  return (
    <StyledSuggestions visible={visible} onMouseDown={onMouseDown}>
      {store.suggestions.list.length > 0 && <Subheading>Search</Subheading>}
      {store.suggestions.list.map(suggestion => (
        <Suggestion suggestion={suggestion} key={suggestion.id} />
      ))}
      {store.searchedTabs.length > 0 && <Subheading>Tabs</Subheading>}
      {store.searchedTabs.map(suggestion => (
        <Suggestion suggestion={suggestion} key={suggestion.id} />
      ))}
    </StyledSuggestions>
  );
});
