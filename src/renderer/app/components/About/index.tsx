import { observer } from 'mobx-react';
import React from 'react';
import { hot } from 'react-hot-loader';
import { Card, Content, Logo } from './styles';
import AboutItem from '../AboutItem';
import store from 'app-store';

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
            <AboutItem title={dictionary.wexondVersion}>
              v{packageFile.version}
            </AboutItem>
            <AboutItem title={dictionary.reactVersion}>
              v{packageFile.devDependencies.react}
            </AboutItem>
            <AboutItem title={dictionary.electronVersion}>
              v{packageFile.devDependencies.electron}
            </AboutItem>
            <AboutItem title={dictionary.nodejsVersion}>
              {process.version}
            </AboutItem>
          </Card>
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(About);
