import * as React from 'react';
import { observer } from 'mobx-react';

import { BookmarksDial } from '../BookmarksDial';
import store from '~/renderer/views/app/store';

export const Dial = observer(() => {
  return <>{store.bookmarks.list.length > 0 && <BookmarksDial />}</>;
});
