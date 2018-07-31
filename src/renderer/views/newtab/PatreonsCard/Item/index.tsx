import React from 'react';

import Patreon from '../../../models/patreon';
import { Root, Avatar, Username } from './styles';

export interface IProps {
  data?: Patreon;
}

export default class Item extends React.Component<IProps, {}> {
  public render() {
    const { data } = this.props;

    return (
      <Root href={data.url}>
        <Avatar src={data.avatar} />
        <Username>{data.username}</Username>
      </Root>
    );
  }
}
