import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { BookmarksDial } from '../BookmarksDial';
import store from '~/renderer/views/app/store';

export const Dial = observer(() => {
  return (
    <>
      {store.bookmarks.list.length > 0 &&
        store.settings.object.overlayBookmarks && <BookmarksDial />}
    </>
  );
});
