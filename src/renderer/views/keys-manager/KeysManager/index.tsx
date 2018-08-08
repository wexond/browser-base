import { observer } from 'mobx-react';
import React from 'react';

import { Content } from './styles';

@observer
export default class KeysManager extends React.Component {
  public render() {
    return <Content>Keys manager</Content>;
  }
}
