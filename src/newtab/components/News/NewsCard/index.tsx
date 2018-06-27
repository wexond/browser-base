import React from 'react';

import { getTimeOffset } from '../../../../shared/utils/time';

import {
  Card, CardHeader, CardHeaderText, CardImage,
} from '../../../../shared/components/Card';

import {
  Title, Info, Icon, Source,
} from './styles';

export interface Props {
  data: any;
}

export default class NewsCard extends React.Component<Props, {}> {
  public render() {
    const { data } = this.props;

    return (
      <Card>
        <CardHeader>
          <CardHeaderText>
            <Title>{data.title}</Title>
            <Info>
              <Icon source={data.icon} />
              <Source>
                {data.source.name} - {getTimeOffset(new Date(data.publishedAt))}
              </Source>
            </Info>
          </CardHeaderText>
          <CardImage src={data.urlToImage} />
        </CardHeader>
      </Card>
    );
  }
}
