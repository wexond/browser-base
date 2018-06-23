import { observer } from 'mobx-react';
import React from 'react';
import { StyledTabBar, TabGroups, AddTabButton } from './styles';
import Store from '../../store';
import TabGroup from '../TabGroup';
import Toolbar from '../Toolbar';

const addTabIcon = require('../../../shared/icons/add.svg');

@observer
export default class TabBar extends React.Component<{}, {}> {
  private tabBar: HTMLDivElement;

  public componentDidMount() {
    Store.getTabBarWidth = () => this.tabBar.offsetWidth;
  }

  public onAddTabButtonClick = () => {
    Store.getCurrentTabGroup().addTab();
  };

  public render() {
    const { theme } = Store.theme;

    const { tabs } = Store.getCurrentTabGroup();

    return (
      <StyledTabBar
        style={{ ...theme.tabbar }}
        visible={!Store.addressBar.toggled}
        innerRef={(r: any) => (this.tabBar = r)}
      >
        <TabGroups>
          {Store.tabGroups.map(tabGroup => <TabGroup key={tabGroup.id} tabGroup={tabGroup} />)}
          <AddTabButton
            icon={addTabIcon}
            onClick={this.onAddTabButtonClick}
            style={{ ...theme.addTabButton }}
            divRef={r => (Store.addTabButton.ref = r)}
          />
        </TabGroups>
      </StyledTabBar>
    );
  }
}
