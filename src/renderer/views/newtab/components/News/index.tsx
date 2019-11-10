import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { StyledNews } from './style';
import store from '../../store';
import { NewsItem } from '../NewsItem';

export const News = observer(() => {
  const rows = [1, 1, 1, 1];
  let nextColumn = 0;
  let fullSizeNextRow = false;
  let key = 0;

  return (
    <StyledNews>
      {store.news.map(item => {
        if (!item.urlToImage) return null;

        const column = nextColumn;

        let width = 1;
        const height = 2;

        if (
          (key % 10 === 0 && column < 3) ||
          (fullSizeNextRow && item.urlToImage)
        ) {
          width = 2;
          fullSizeNextRow = false;
        } else if (key % 5 === 0 && column === 3) {
          fullSizeNextRow = true;
        }

        let row = rows[column];

        for (let i = column; i <= column + width - 1; i++) {
          if (rows[i] > row) row = rows[i];
        }

        for (let i = column; i <= column + width - 1; i++) {
          rows[i] = row + height;
        }

        if ((column + 1) % 4 === 0) nextColumn = 0;
        else nextColumn += width;

        key++;

        return (
          <NewsItem
            column={column}
            row={row}
            item={item}
            key={key}
            width={width}
            height={height}
          ></NewsItem>
        );
      })}
    </StyledNews>
  );
});
