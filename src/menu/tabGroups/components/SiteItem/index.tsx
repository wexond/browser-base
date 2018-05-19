import { observer } from 'mobx-react';
import React from 'react';

import { StyledSiteItem, Icon, Title } from './styles';

interface Props {
  title?: string;
  icon?: string;
}

export default class SiteItem extends React.Component<Props, {}> {
  public render() {
    const { title, icon } = this.props;

    return (
      <StyledSiteItem>
        <Icon />
        <Title>{title}</Title>
      </StyledSiteItem>
    );
  }
}
