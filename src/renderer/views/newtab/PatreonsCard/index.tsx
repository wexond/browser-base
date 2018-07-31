import React from 'react';

import * as Card from '../../../shared/components/Card';
import Item from './Item';
import Patreon from '../../models/patreon';
import { Content, Header } from './styles';

export default class WeatherCard extends React.Component {
  public render() {
    const patreonExample: Patreon = {
      username: 'Nersent',
      url: 'https://www.patreon.com/nersent',
      avatar:
        'https://c10.patreonusercontent.com/3/eyJ3IjoyMDB9/patreon-media/p/user/12270966/1b014cf4669445bfa812d5abb60fc18b/1?token-time=2145916800&token-hash=Y32eB2WPEpRpA4V4e7JdQTg5PPnsj7ImIxm-0JHB3Zk%3D',
    };

    return (
      <Card.Root>
        <Header>
          <Card.Title large>Patreons</Card.Title>
        </Header>
        <Content>
          <Item data={patreonExample} />
        </Content>
      </Card.Root>
    );
  }
}
