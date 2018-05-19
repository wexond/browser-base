import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import { Content } from './styles';

@observer
class TabGroups extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Content>Foo</Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(TabGroups);
