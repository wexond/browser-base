import * as React from 'react';
import { observer } from 'mobx-react-lite';

import {
  StyledNewsItem,
  Image,
  Info,
  Title,
  Footer,
  SourceIcon,
  Source,
  Fill,
  Overline,
  Description,
} from './style';
import store from '../../store';
import { INewsItem } from '~/interfaces/news-item';

export const NewsItem = observer(
  ({
    item,
    column,
    row,
    width,
    height,
  }: {
    item: INewsItem;
    column: number;
    row: number;
    width: number;
    height: number;
  }) => {
    const fullSize = width === 2;

    return (
      <StyledNewsItem
        style={{
          gridArea: `${row} / ${column + 1} / span ${height} / span ${width}`,
        }}
      >
        <Image fullSize={fullSize} src={item.urlToImage}></Image>
        <Info fullSize={fullSize}>
          <Title fullSize={fullSize}>{item.title}</Title>
          {!fullSize && <Description>{item.description}</Description>}

          <Footer>
            <SourceIcon
              src={`https://www.google.com/s2/favicons?domain=${item.source.name}`}
            ></SourceIcon>
            <Source>{item.source.name}</Source>
          </Footer>
        </Info>
      </StyledNewsItem>
    );
  },
);
