import * as React from 'react';
import { observer } from 'mobx-react';

import { Actions } from '../../../style';
import { Bubble } from '../Bubble';
import store from '~/renderer/views/app/store';
import { loadURL } from '~/renderer/views/app/utils';

export const BookmarksDial = observer(() => {
  return (
    <Actions>
      {store.bookmarks.list.map(item => (
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
