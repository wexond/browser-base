import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { Favicon, Title, Site, More } from './style';
import { Bookmark } from '../../models/bookmark';
import { ListItem } from '../ListItem';

const onClick = (item: Bookmark) => (e: React.MouseEvent) => {
  if (!e.ctrlKey) return;

  const index = store.bookmarks.selectedItems.indexOf(item._id);

  if (index === -1) {
    store.bookmarks.selectedItems.push(item._id);
  } else {
    store.bookmarks.selectedItems.splice(index, 1);
  }
};

const onTitleClick = (url: string) => (e: React.MouseEvent) => {
  if (!e.ctrlKey) {
    store.tabs.addTab({ url, active: true });
    store.overlay.visible = false;
  }
};

const onMoreClick = (data: Bookmark) => (e: any) => {
  e.stopPropagation();

  const { left, top } = e.currentTarget.getBoundingClientRect();

  store.bookmarks.menuVisible = true;
  store.bookmarks.menuLeft = left;
  store.bookmarks.menuTop = top;
  store.bookmarks.currentBookmark = data;
};

export default observer(({ data }: { data: Bookmark }) => {
  const selected = store.bookmarks.selectedItems.includes(data._id);

  return (
    <ListItem key={data._id} onClick={onClick(data)} selected={selected}>
      <Favicon
        style={{
          backgroundImage: `url(${store.favicons.favicons[data.favicon]})`,
        }}
      />
      <Title onClick={onTitleClick(data.url)}>{data.title}</Title>
      <Site>{data.url}</Site>
      <More onClick={onMoreClick(data)} />
    </ListItem>
  );
});
