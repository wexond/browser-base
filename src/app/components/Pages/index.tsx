import { observer } from 'mobx-react';
import React from 'react';
import StyledPages from './styles';
import Store from '../../store';
import Page from '../Page';

export default observer(() => (
  <StyledPages>{Store.pages.map(page => <Page key={page.id} page={page} />)}</StyledPages>
));
