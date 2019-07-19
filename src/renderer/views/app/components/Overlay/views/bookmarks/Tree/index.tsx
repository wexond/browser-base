import * as React from 'react';
import { observer } from 'mobx-react';

import store from '~/renderer/views/app/store';
import TreeItem from '../TreeItem';
import { StyledTreeView } from './styles';

export default observer(() => {
  return (
    <StyledTreeView>
      {store.bookmarks.list
        .filter(e => !e.parent)
        .map(item => (
          <TreeItem key={item._id} data={item} depth={0} />
        ))}
    </StyledTreeView>
  );
});
