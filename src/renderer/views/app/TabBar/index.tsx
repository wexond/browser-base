import { observer } from 'mobx-react';
import React from 'react';

import { createTab } from '../../../../utils';
import store from '../../../store';
import Tabs from '../Tabs';
import { AddTab, StyledTabbar, TabsContainer } from './styles';
import { icons } from '../../../../defaults';

@observer
export default class Tabbar extends React.Component {
  public onAddTabClick = () => {
    createTab();
  }

  public render() {
    return (
      <StyledTabbar
        visible={!store.addressBar.toggled}
        innerRef={r => (store.tabbarRef = r)}
      >
        <TabsContainer>
          <Tabs />
        </TabsContainer>
        <AddTab
          icon={icons.add}
          onClick={this.onAddTabClick}
          divRef={r => (store.addTabRef = r)}
        />
      </StyledTabbar>
    );
  }
}
