import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Item, Icon, Title } from './style';
import { IHistoryItem } from '~/interfaces';
import { icons } from '~/renderer/constants';
import store from '../../store';

export const TopSite = observer(({ item }: { item?: IHistoryItem }) => {
  const { title, favicon, url } = item || {};

  const custom = favicon === '' || favicon == null;

  let fav = icons.page;

  if (!custom) {
    fav = store.favicons.get(favicon);
  }

  return (
    <Item>
      <Icon custom={custom} icon={fav} add={item == null}></Icon>
      {title && <Title>{title}</Title>}
    </Item>
  );
});
