import { observer } from 'mobx-react';
import React from 'react';

import { StyledItem, Title, Content } from './styles';

interface Props {
  title?: string;
}

export default class Item extends React.Component<Props, {}> {
  public render() {
    const { title, children } = this.props;

    return (
      <StyledItem>
        <Title>{title}:</Title>
        <Content>{children}</Content>
      </StyledItem>
    );
  }
}
