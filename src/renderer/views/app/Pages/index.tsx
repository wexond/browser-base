import { observer } from 'mobx-react';
import React from 'react';
import StyledPages from './styles';
import Page from '../Page';
import store from '../../../store';

export default observer(() => (
  <StyledPages>
    {store.pages.map(page => (
      <Page key={page.id} page={page} />
    ))}
  </StyledPages>
));
