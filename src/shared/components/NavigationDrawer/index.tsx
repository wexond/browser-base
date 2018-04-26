import React from 'react';
import { observer } from 'mobx-react';

import { StyledNavigationDrawer } from './styles';

@observer
export default class NavigationDrawer extends React.Component {
  public render() {
    return <StyledNavigationDrawer />;
  }
}
