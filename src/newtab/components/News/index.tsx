import React from 'react';

import { StyledNews } from './styles';

import NewsCard from './NewsCard';

export interface Props {
  data: any;
}

export default class News extends React.Component<Props, {}> {
  public render() {
    const { data } = this.props;

    return <StyledNews>{data != null && <NewsCard data={data[1]} />}</StyledNews>;
  }
}

/*
{data != null
          && data.articles.map((news: any, key: any) => {
            const x = 5;
            return <div>xd</div>;
          })}
          */
