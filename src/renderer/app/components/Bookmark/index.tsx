import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { Favicon, Item, Title, Site, More } from './style';
import { Bookmark } from '../../models/bookmark';

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

const onRemoveClick = (item: Bookmark) => () => {
  store.history.removeItem(item._id);
};

export default observer(({ data }: { data: Bookmark }) => {
  const selected = store.history.selectedItems.indexOf(data._id) !== -1;

  return (
    <Item key={data._id} onClick={onClick(data)} selected={selected}>
      <Favicon
        style={{
          backgroundImage: `url(${store.favicons.favicons[data.favicon]})`,
        }}
      />
      <Title onClick={onTitleClick(data.url)}>{data.title}</Title>
      <Site>{data.url}</Site>
      <More />
    </Item>
  );
});
