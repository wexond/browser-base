import * as React from 'react';
import { observer } from 'mobx-react';

import { Bubble } from '../Bubble';
import { loadURL } from '~/renderer/views/app/utils';
import { Actions } from '../../../style';
import store from '~/renderer/views/app/store';

export const TopSites = observer(() => {
  return (
    <Actions>
      {store.history.topSites.map(item => (
        <Bubble
          itemsPerRow={6}
          onClick={loadURL(item.url)}
          key={item._id}
          maxLines={1}
          iconSize={20}
          icon={store.favicons.favicons[item.favicon]}
        >
          {item.title}
        </Bubble>
      ))}
    </Actions>
  );
});
