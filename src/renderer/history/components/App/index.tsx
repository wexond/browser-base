import React from 'react';
import { observer } from 'mobx-react';

import NavigationDrawer from '@components/NavigationDrawer';
import store from '@history/store';
import { StyledApp } from './styles';
import { icons } from '~/renderer/defaults';

@observer
export default class App extends React.Component {
  componentDidMount() {
    store.loadHistory();
  }

  public render() {
    return (
      <StyledApp>
        <NavigationDrawer title="History" search>
          <NavigationDrawer.Item title="Select all" icon={icons.selectAll} />
          <NavigationDrawer.Item title="Delete all" icon={icons.delete} />
        </NavigationDrawer>
      </StyledApp>
    );
  }
}
