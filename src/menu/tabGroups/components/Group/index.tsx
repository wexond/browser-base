import { observer } from 'mobx-react';
import React from 'react';

import {
  StyledGroup, Bar, Border, Title, Expand, Content,
} from './styles';

import SiteItem from '../SiteItem';

interface Props {
  title?: string;
}

interface State {
  expanded: boolean;
}

export default class Group extends React.Component<Props, State> {
  public state: State = {
    expanded: false,
  };

  private Expand = () => {
    this.setState(({ expanded }) => ({
      expanded: !expanded,
    }));
  };

  public render() {
    const { title } = this.props;
    const { expanded } = this.state;

    return (
      <StyledGroup>
        <Bar>
          <Border selected />
          <Title>{title}</Title>
          <Expand expanded={expanded} onClick={this.Expand} />
        </Bar>
        <Content expanded={expanded}>
          <SiteItem title="Wexond" />
        </Content>
      </StyledGroup>
    );
  }
}
