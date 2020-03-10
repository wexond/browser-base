import * as React from 'react';
import { observer } from 'mobx-react-lite';

import {
  StyledNewsItem,
  Img,
  Info,
  Title,
  Footer,
  Source,
  Fill,
  Description,
} from './style';
import { INewsItem } from '~/interfaces/news-item';

export const NewsItem = observer(({ item }: { item: INewsItem }) => {
  // eslint-disable-next-line prefer-const
  let [img, setImg] = React.useState('');

  const image = new Image();
  const src = item.urlToImage;

  image.onload = () => {
    setImg(src);
  };
  image.src = src;

  if (image.complete) {
    img = src;
  }

  return (
    <StyledNewsItem href={item.url}>
      <Img src={img}></Img>
      <Info>
        <Title>{item.title}</Title>
        <Description>{item.description}</Description>
        <Fill />
        <Footer>
          <Source>{item.source.name}</Source>
        </Footer>
      </Info>
    </StyledNewsItem>
  );
});
