import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { HistoryItem } from '../../models';
import { formatTime } from '../../utils';
import { Favicon, Remove, Title, Time, Site } from './style';
import { ListItem } from '../ListItem';

const onClick = (item: HistoryItem) => (e: React.MouseEvent) => {
  if (!e.ctrlKey) return;

  const index = store.history.selectedItems.indexOf(item._id);

  if (index === -1) {
    store.history.selectedItems.push(item._id);
  } else {
    store.history.selectedItems.splice(index, 1);
  }
};

const onTitleClick = (url: string) => (e: React.MouseEvent) => {
  if (!e.ctrlKey) {
    store.tabs.addTab({ url, active: true });
    store.overlay.visible = false;
  }
};

const onRemoveClick = (item: HistoryItem) => () => {
  store.history.removeItem(item._id);
};

export default observer(({ data }: { data: HistoryItem }) => {
  const selected = store.history.selectedItems.includes(data._id);

  return (
    <ListItem key={data._id} onClick={onClick(data)} selected={selected}>
      <Favicon
        style={{
          backgroundImage: `url(${store.favicons.favicons[data.favicon]})`,
        }}
      />
      <Title onClick={onTitleClick(data.url)}>{data.title}</Title>
      <Site>{data.url.split('/')[2]}</Site>
      <Time>{formatTime(new Date(data.date))}</Time>
      <Remove onClick={onRemoveClick(data)} />
    </ListItem>
  );
});
