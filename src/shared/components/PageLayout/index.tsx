import React from 'react';
import { observer } from 'mobx-react';

import Toolbar from '../Toolbar';
import NavigationDrawer from '../NavigationDrawer';

import { StyledPageLayout, Container, Content } from './styles';

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
          <Content>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus voluptatibus,
            tempore facilis accusamus, eaque officiis repudiandae saepe deserunt error temporibus
            ducimus repellat natus ad vel vero dolorum possimus omnis nulla?Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Ab eos aliquid nesciunt tempore magnam, voluptas illo
            quod odit quia impedit dignissimos aut repellendus inventore est reprehenderit amet
            minima sed atque!Lorem
          </Content>
        </Container>
      </StyledPageLayout>
    );
  }
}
