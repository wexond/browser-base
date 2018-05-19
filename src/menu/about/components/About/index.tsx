import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';

import { Content, Logo, Card } from './styles';

import Item from '../Item';

const packageFile = require('../../../../../package.json');

@observer
class About extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Content>
          <Logo />
          <Card>
            <Item title="Wexond version">v{packageFile.version}</Item>
            <Item title="React version">v{packageFile.devDependencies.react}</Item>
            <Item title="Electron version">v{packageFile.devDependencies.electron}</Item>
            <Item title="Nodejs version">{process.version}</Item>
          </Card>
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(About);
