import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { StyledNews } from './style';
import store from '../../store';
import { NewsItem } from '../NewsItem';

export const News = observer(() => {
  return (
    <StyledNews>
      {store.news.map((item, key) => {
        if (!item.urlToImage) return null;

        return <NewsItem item={item} key={key}></NewsItem>;
      })}
    </StyledNews>
  );
});
