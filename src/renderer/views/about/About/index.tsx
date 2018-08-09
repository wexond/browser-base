import { observer } from 'mobx-react';
import React from 'react';
import { hot } from 'react-hot-loader';
import store from '../../../store';
import Item from '../Item';
import { Card, Content, Logo } from './styles';

const packageFile = require('../../../../../package.json');

@observer
class About extends React.Component {
  public render() {
    const dictionary = store.dictionary.about;

    return (
      <React.Fragment>
        <Content>
          <Logo />
          <Card>
            <Item title={dictionary.wexondVersion}>v{packageFile.version}</Item>
            <Item title={dictionary.ReactVersion}>
              v{packageFile.devDependencies.React}
            </Item>
            <Item title={dictionary.electronVersion}>
              v{packageFile.devDependencies.electron}
            </Item>
            <Item title={dictionary.nodejsVersion}>{process.version}</Item>
          </Card>
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(About);
