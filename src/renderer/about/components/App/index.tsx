import * as React from 'react';

import Item from '../Item';
import { StyledApp, Logo, Container } from './styles';

export default class App extends React.Component {
  public render() {
    console.log(process);

    return (
      <StyledApp>
        <Logo />
        <Container>
          <Item title="Wexond version">v1</Item>
          <Item title="React version">v1</Item>
          <Item title="Electron version">v1</Item>
        </Container>
      </StyledApp>
    );
  }
}
