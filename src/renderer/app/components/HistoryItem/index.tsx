import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { HistoryItem } from '../../models';
import { formatTime } from '../../utils';
import { Favicon, Item, Remove, Title, Time, Site } from './style';

const onClick = (data: HistoryItem) => (e: React.MouseEvent) => {
  if (e.ctrlKey) {
    data.selected = !data.selected;
  }
};

export default observer(({ data }: { data: HistoryItem }) => {
  return (
    <Item key={data._id} onClick={onClick(data)} selected={data.selected}>
      <Favicon
        style={{
          backgroundImage: `url(${store.faviconsStore.favicons[data.favicon]})`,
        }}
      />
      <Title>{data.title}</Title>
      <Site>{data.url.split('/')[2]}</Site>
      <Time>{formatTime(new Date(data.date))}</Time>
      <Remove />
    </Item>
  );
});
