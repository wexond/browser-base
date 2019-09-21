import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Favicon, Remove, Title, Time, Site } from './style';
import { IHistoryItem } from '~/interfaces';
import { ListItem } from '~/renderer/components/ListItem';
import { formatTime } from '../../utils';
import store from '../../store';
import { icons } from '~/renderer/constants';

const onClick = (item: IHistoryItem) => (e: React.MouseEvent) => {
  if (!e.ctrlKey && !e.metaKey) return;

  const index = store.selectedItems.indexOf(item._id);

  if (index === -1) {
    store.selectedItems.push(item._id);
  } else {
    store.selectedItems.splice(index, 1);
  }
};

const onTitleClick = (url: string) => (e: React.MouseEvent) => {
  if (!e.ctrlKey) {
    // TODO: open url in new tab
  }
};

const onRemoveClick = (item: IHistoryItem) => () => {
  store.removeItem(item._id);
};

export default observer(({ data }: { data: IHistoryItem }) => {
  const selected = store.selectedItems.includes(data._id);

  let { favicon } = data;
  let customFavicon = false;

  if (favicon == null || favicon.trim() === '') {
    favicon = icons.page;
  } else {
    // TODO: favicon = store.favicons.get(data.favicon);
    customFavicon = true;
  }

  return (
    <ListItem key={data._id} onClick={onClick(data)} selected={selected}>
      <Favicon
        style={{
          backgroundImage: `url(${favicon})`,
          opacity: customFavicon ? 1 : 0.54,
        }}
      />
      <Title onClick={onTitleClick(data.url)}>{data.title}</Title>
      <Site>{data.url.split('/')[2]}</Site>
      <Time>{formatTime(new Date(data.date))}</Time>
      <Remove onClick={onRemoveClick(data)} />
    </ListItem>
  );
});
