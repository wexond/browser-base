import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Favicon, Title, Site, More } from './style';
import { IBookmark } from '~/interfaces';
import store from '../../store';
import { icons } from '~/renderer/constants';
import { getBookmarkTitle } from '~/renderer/views/app/utils/bookmarks';
import { ListItem } from '~/renderer/components/ListItem';

const onClick = (item: IBookmark) => (e: React.MouseEvent) => {
  const index = store.selectedItems.indexOf(item._id);

  if (index === -1) {
    if (e.ctrlKey) {
      store.selectedItems.push(item._id);
    } else {
      (store.selectedItems as any).replace([item._id]);
    }
  } else {
    store.selectedItems.splice(index, 1);
  }
};

const onDoubleClick = (item: IBookmark) => () => {
  if (item.isFolder) {
    store.currentFolder = item._id;
  }
};

const onTitleClick = (item: IBookmark) => (e: React.MouseEvent) => {
  if (!e.ctrlKey && !item.isFolder) {
    // TODO: open bookmark in new tab
  }
};

const onMoreClick = (data: IBookmark) => (e: any) => {
  e.stopPropagation();

  const { left, top } = e.currentTarget.getBoundingClientRect();

  store.menuVisible = true;
  store.menuLeft = left;
  store.menuTop = top;
  store.currentBookmark = data;
};

export const Bookmark = observer(({ data }: { data: IBookmark }) => {
  const selected = store.selectedItems.includes(data._id);

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
              : store.favicons.get(data.favicon)
          })`,
          filter:
            store.theme['pages.lightForeground'] && data.isFolder
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
