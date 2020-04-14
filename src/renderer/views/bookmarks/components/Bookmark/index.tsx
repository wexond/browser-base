import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Favicon, Title, Site, More } from './style';
import { IBookmark } from '~/interfaces';
import store from '../../store';
import { ListItem } from '~/renderer/components/ListItem';
import { getBookmarkTitle } from '../../utils';
import { ICON_PAGE, ICON_FOLDER } from '~/renderer/constants/icons';

const onClick = (item: IBookmark) => (e: React.MouseEvent<HTMLDivElement>) => {
  const index = store.selectedItems.indexOf(item._id);

  if (e.ctrlKey) {
    if (index === -1) {
      store.selectedItems.push(item._id);
    } else {
      store.selectedItems.splice(index, 1);
    }
  } else {
    store.selectedItems = [item._id];
  }
};

const onDoubleClick = (item: IBookmark) => () => {
  if (item.isFolder) {
    store.currentFolder = item._id;
  } else {
    const win = window.open(item.url, '_blank');
    win.focus();
  }
};

const onMoreClick = (data: IBookmark) => (e: any) => {
  e.stopPropagation();

  const { left, top } = e.currentTarget.getBoundingClientRect();

  store.menuVisible = true;
  store.menuLeft = left - 130;
  store.menuTop = top;
  store.currentBookmark = data;
};

const onContextMenu = (data: IBookmark) => (e: any) => {
  e.preventDefault();

  onClick(data)(e);

  const { pageX, pageY } = e;

  store.menuVisible = true;
  store.menuLeft = pageX;
  store.menuTop = pageY;
  store.currentBookmark = data;
};

export const Bookmark = observer(({ data }: { data: IBookmark }) => {
  const selected = store.selectedItems.includes(data._id);

  let favicon = data.favicon;
  let customFavicon = false;

  if (data.isFolder) {
    favicon = ICON_FOLDER;
    customFavicon = true;
  } else {
    if (favicon) {
      if (favicon.startsWith('data:')) {
        favicon = data.favicon;
      } else {
        favicon = store.favicons.get(data.favicon);
      }
    } else {
      favicon = ICON_PAGE;
      customFavicon = true;
    }
  }

  return (
    <ListItem
      onContextMenu={onContextMenu(data)}
      onDoubleClick={onDoubleClick(data)}
      key={data._id}
      onClick={onClick(data)}
      selected={selected}
      style={{ borderRadius: 0 }}
    >
      <Favicon
        style={{
          backgroundImage: `url(${favicon})`,
          filter:
            store.theme['pages.lightForeground'] && customFavicon
              ? 'invert(100%)'
              : 'none',
        }}
      />
      <Title>{getBookmarkTitle(data)}</Title>
      <Site>{data.url}</Site>
      {!data.static && <More onClick={onMoreClick(data)} />}
    </ListItem>
  );
});
