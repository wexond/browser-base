import { observer } from 'mobx-react';
import React from 'react';

// Styles
import { StyledSuggestions, Caption } from './styles';

import Suggestion from '../Suggestion';

export default observer(() => (
  <StyledSuggestions>
    <Caption>Most visited</Caption>
    <Suggestion>www.nersent.tk &mdash; Nersent</Suggestion>
    <Suggestion>www.nersent.tk &mdash; Nersent</Suggestion>

    <Caption>Bookmarks</Caption>
    <Suggestion>www.nersent.tk &mdash; Nersent</Suggestion>
    <Suggestion>www.nersent.tk &mdash; Nersent</Suggestion>
    <Suggestion>www.nersent.tk &mdash; Nersent</Suggestion>
    <Suggestion>www.nersent.tk &mdash; Nersent</Suggestion>

    <Caption>Google suggestions</Caption>
    <Suggestion>nersent</Suggestion>
    <Suggestion>nersent</Suggestion>
    <Suggestion>nersent</Suggestion>
    <Suggestion>nersent</Suggestion>
  </StyledSuggestions>
));
