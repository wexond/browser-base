import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Item, Icon, Title } from './style';
import { IHistoryItem } from '~/interfaces';
import store from '../../store';
import { ICON_PAGE } from '~/renderer/constants';

const onClick = (url: string) => () => {
  if (url !== '' && url != null) {
    window.location.href = url;
  }
};

export const TopSite = observer(({ item }: { item?: IHistoryItem }) => {
  const { title, favicon, url } = item || {};
  const custom = favicon === '' || favicon == null;

  let fav = ICON_PAGE;

  if (!custom) {
    fav = favicon;
  }

  return (
    <Item imageSet={store.imageVisible} onClick={onClick(url)}>
      <Icon
        imageSet={store.imageVisible}
        custom={custom}
        icon={fav}
        add={item == null}
      ></Icon>
      {title && <Title>{title}</Title>}
    </Item>
  );
});
