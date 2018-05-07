import React from 'react';
import { observer } from 'mobx-react';
import Toolbar from '../Toolbar';
import NavigationDrawer from '../NavigationDrawer';
import { StyledPageLayout, Content } from './styles';

export interface IProps {
  title?: string;
  children?: any;
}

@observer
export default class PageLayout extends React.Component<IProps, {}> {
  public render() {
    const { title } = this.props;

    return (
      <StyledPageLayout>
        <NavigationDrawer />
        <Toolbar title={title} />
        <Content>{this.props.children}</Content>
      </StyledPageLayout>
    );
  }
}
