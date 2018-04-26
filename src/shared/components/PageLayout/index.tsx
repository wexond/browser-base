import React from 'react';
import { observer } from 'mobx-react';

import Toolbar from '../Toolbar';
import NavigationDrawer from '../NavigationDrawer';

import { StyledPageLayout, Container } from './styles';

export interface IProps {
  title?: string;
}

@observer
export default class PageLayout extends React.Component<IProps, {}> {
  public render() {
    const { title } = this.props;

    return (
      <StyledPageLayout>
        <NavigationDrawer />
        <Container>
          <Toolbar title={title} />
        </Container>
      </StyledPageLayout>
    );
  }
}
