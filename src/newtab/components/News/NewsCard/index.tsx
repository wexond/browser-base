import React from 'react';

import { loadImage } from '../../../../shared/utils/network';
import { getTimeOffset } from '../../../../shared/utils/time';

import { Card, CardHeader, CardImage } from '../../../../shared/components/Card';

import {
  CardHeaderText, Title, Info, Icon, Source,
} from './styles';

export interface Props {
  data: any;
}

export interface State {
  loaded: boolean;
}

export default class NewsCard extends React.Component<Props, State> {
  public state: State = {
    loaded: false,
  };

  public async componentDidMount() {
    const { data } = this.props;

    await loadImage(data.urlToImage);
    await loadImage(data.icon);

    this.setState({ loaded: true });
  }

  public render() {
    const { data } = this.props;
    const { loaded } = this.state;

    return (
      <a href={data.url}>
        <Card>
          <CardHeader logo>
            <CardHeaderText>
              <Title>{data.title}</Title>
              <Info>
                <Icon visible={loaded} source={data.icon} />
                <Source>
                  {data.source.name} - {getTimeOffset(new Date(data.publishedAt))}
                </Source>
              </Info>
            </CardHeaderText>
            <CardImage visible={loaded} src={data.urlToImage} />
          </CardHeader>
        </Card>
      </a>
    );
  }
}
