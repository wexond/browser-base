import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Favicon, Remove, Title, Time, Site, TitleContainer } from './style';
import { IHistoryItem } from '~/interfaces';
import { ListItem } from '~/renderer/components/ListItem';
import { formatTime } from '../../utils';
import store from '../../store';
import { ICON_PAGE } from '~/renderer/constants/icons';

const onClick = (item: IHistoryItem) => () => {
  const index = store.selectedItems.indexOf(item._id);

  if (index === -1) {
    store.selectedItems.push(item._id);
  } else {
    store.selectedItems.splice(index, 1);
  }
};

const onRemoveClick = (item: IHistoryItem) => (
  e: React.MouseEvent<HTMLDivElement>,
) => {
  e.stopPropagation();
  store.removeItems([item._id]);
};

const onTitleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.stopPropagation();
};

export default observer(({ data }: { data: IHistoryItem }) => {
  const selected = store.selectedItems.includes(data._id);

  let { favicon } = data;
  let customFavicon = false;

  if (favicon == null || favicon.trim() === '') {
    favicon = ICON_PAGE;
  } else {
    favicon = store.favicons.get(data.favicon);
    customFavicon = true;
  }

  return (
    <ListItem key={data._id} onClick={onClick(data)} selected={selected}>
      <Favicon
        style={{
          backgroundImage: `url(${favicon})`,
          opacity: customFavicon ? 1 : 0.54,
          filter:
            !customFavicon && store.theme['pages.lightForeground']
              ? 'invert(100%)'
              : 'none',
        }}
      />
      <TitleContainer>
        <Title onClick={onTitleClick} href={data.url} target="_blank">
          {data.title}
        </Title>
      </TitleContainer>
      <Site>{data.url.split('/')[2]}</Site>
      <Time>{formatTime(new Date(data.date))}</Time>
      <Remove onClick={onRemoveClick(data)} />
    </ListItem>
  );
});
