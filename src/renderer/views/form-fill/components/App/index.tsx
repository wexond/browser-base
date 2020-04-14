import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';

import List from '../List';
import { StyledApp } from './style';
import { UIStyle } from '~/renderer/mixins/default-styles';

export const App = hot(
  observer(() => {
    return (
      <StyledApp>
        <UIStyle />
        <List />
      </StyledApp>
    );
  }),
);
