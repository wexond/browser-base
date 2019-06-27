import * as React from 'react';
import { observer } from 'mobx-react';
import { Actions } from '../Overlay/style';
import store from '../../store';
import { Bubble } from '../Bubble';
import { onSiteClick } from '../../utils/dials';

export const BookmarksDial = observer(() => {
  return (
    <Actions>
      {store.bookmarks.list.map(item => (
        <Bubble
          itemsPerRow={6}
          onClick={onSiteClick(item.url)}
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
