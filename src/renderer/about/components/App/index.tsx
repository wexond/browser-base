import React from 'react';

import Item from '../Item';
import { StyledApp, Logo, Container } from './styles';

const packageFile = require('../../../../../package.json');

export default class App extends React.Component {
  public render() {
    console.log(process);

    return (
      <StyledApp>
        <Logo />
        <Container>
          <Item title="Wexond version">v{packageFile.version}</Item>
          <Item title="React version">
            v{packageFile.devDependencies.react}
          </Item>
          <Item title="Electron version">
            v{packageFile.devDependencies.electron}
          </Item>
        </Container>
      </StyledApp>
    );
  }
}
