import React from 'react';

import { StyledNews } from './styles';

import NewsCard from './NewsCard';

export interface Props {
  data: any;
}

export default class News extends React.Component<Props, {}> {
  public render() {
    const { data } = this.props;

    return (
      <StyledNews>
        {data != null && data.map((news: any, key: any) => <NewsCard data={news} key={key} />)}
      </StyledNews>
    );
  }
}
