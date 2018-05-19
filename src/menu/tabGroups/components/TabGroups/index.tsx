import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import { Content } from './styles';

import Goup from '../Group';

@observer
class TabGroups extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Content>
          <Goup title="First group" />
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(TabGroups);
