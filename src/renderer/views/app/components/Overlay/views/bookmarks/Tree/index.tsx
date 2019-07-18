import * as React from 'react';
import { observer } from 'mobx-react';

import store from '~/renderer/views/app/store';
import TreeItem from '../TreeItem';
import { StyledTreeView } from './styles';

export default observer(() => {
  return (
    <StyledTreeView>
      <TreeItem
        data={{
          name: 'First',
          children: [
            {
              name: 'First.1',
              children: [{ name: 'First.1.1', children: [] }],
            },
            {
              name: 'First.2',
              children: [],
            },
          ],
        }}
      />
      <TreeItem
        data={{
          name: 'Second',
          children: [
            {
              name: 'Second.1',
              children: [],
            },
          ],
        }}
      />
      <TreeItem
        data={{
          name: 'Third',
          children: [],
        }}
      />
    </StyledTreeView>
  );
});
