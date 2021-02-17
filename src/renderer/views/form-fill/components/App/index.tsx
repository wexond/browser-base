import * as React from 'react';
import { observer } from 'mobx-react-lite';

import List from '../List';
import { StyledApp } from './style';
import { UIStyle } from '~/renderer/mixins/default-styles';

export const App = observer(() => {
  return (
    <StyledApp>
      <UIStyle />
      <List />
    </StyledApp>
  );
});
