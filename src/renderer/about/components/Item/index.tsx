import * as React from 'react';

import { Content, StyledItem, Title } from './styles';

export default class Item extends React.Component<{ title?: string }, {}> {
  public render() {
    const { title, children } = this.props;

    return (
      <StyledItem>
        <Title>{title}</Title>
        <Content>{children}</Content>
      </StyledItem>
    );
  }
}
