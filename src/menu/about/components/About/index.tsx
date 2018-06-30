import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import GlobalStore from '../../../../global-store';
import { Content, Logo, Card } from './styles';
import Item from '../Item';

const packageFile = require('../../../../../package.json');

@observer
class About extends React.Component {
  public render() {
    const dictionary = GlobalStore.dictionary.about;

    return (
      <React.Fragment>
        <Content>
          <Logo />
          <Card>
            <Item title={dictionary.wexondVersion}>v{packageFile.version}</Item>
            <Item title={dictionary.reactVersion}>v{packageFile.devDependencies.react}</Item>
            <Item title={dictionary.electronVersion}>v{packageFile.devDependencies.electron}</Item>
            <Item title={dictionary.nodejsVersion}>{process.version}</Item>
          </Card>
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(About);
