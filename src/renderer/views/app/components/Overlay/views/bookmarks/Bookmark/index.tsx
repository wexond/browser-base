import * as React from 'react';
import { observer } from 'mobx-react';

import { Favicon, Title, Site, More } from './style';
import { IBookmark } from '~/interfaces';
import store from '~/renderer/views/app/store';
import { ListItem } from '../../../components/ListItem';
import { icons } from '~/renderer/constants';
import { getBookmarkTitle } from '~/renderer/views/app/utils/bookmarks';

const onClick = (item: IBookmark) => (e: React.MouseEvent) => {
  const index = store.bookmarks.selectedItems.indexOf(item._id);

  if (index === -1) {
    if (e.ctrlKey) {
      store.bookmarks.selectedItems.push(item._id);
    } else {
      (store.bookmarks.selectedItems as any).replace([item._id]);
    }
  } else {
    store.bookmarks.selectedItems.splice(index, 1);
  }
};

const onDoubleClick = (item: IBookmark) => (e: React.MouseEvent) => {
  if (item.isFolder) {
    store.bookmarks.currentFolder = item._id;
  }
};

const onTitleClick = (item: IBookmark) => (e: React.MouseEvent) => {
  if (!e.ctrlKey && !item.isFolder) {
    store.tabs.addTab({ url: item.url, active: true });
    store.overlay.visible = false;
  }
};

const onMoreClick = (data: IBookmark) => (e: any) => {
  e.stopPropagation();

  const { left, top } = e.currentTarget.getBoundingClientRect();

  store.bookmarks.menuVisible = true;
  store.bookmarks.menuLeft = left;
  store.bookmarks.menuTop = top;
  store.bookmarks.currentBookmark = data;
};

export const Bookmark = observer(({ data }: { data: IBookmark }) => {
  const selected = store.bookmarks.selectedItems.includes(data._id);

  return (
    <ListItem
      onDoubleClick={onDoubleClick(data)}
      key={data._id}
      onClick={onClick(data)}
      selected={selected}
      style={{ borderRadius: 0 }}
    >
      <Favicon
        style={{
          backgroundImage: `url(${
            data.isFolder
              ? icons.folder
              : data.favicon.startsWith('data:image')
              ? data.favicon
              : store.favicons.favicons.get(data.favicon)
          })`,
          filter:
            store.theme['overlay.foreground'] === 'light' && data.isFolder
              ? 'invert(100%)'
              : 'none',
        }}
      />
      <Title onClick={onTitleClick(data)}>{getBookmarkTitle(data)}</Title>
      <Site>{data.url}</Site>
      {!data.static && <More onClick={onMoreClick(data)} />}
    </ListItem>
  );
});
