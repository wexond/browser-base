import { observer } from 'mobx-React';
import React from 'react';

import { createTab } from '../../../../utils';
import store from '../../../store';
import Tabs from '../Tabs';
import {
  AddTab, Indicator, StyledTabbar, TabsContainer,
} from './styles';

@observer
export default class Tabbar extends React.Component {
  public onClick = () => {
    createTab();
  }

  public render() {
    return (
      <StyledTabbar innerRef={(r) => (store.tabbarRef = r)}>
        <TabsContainer>
          <Tabs />
          <Indicator innerRef={(r) => (store.tabIndicatorRef = r)} />
        </TabsContainer>
        <AddTab innerRef={(r) => (store.addTabRef = r)} onClick={this.onClick} />
      </StyledTabbar>
    );
  }
}
