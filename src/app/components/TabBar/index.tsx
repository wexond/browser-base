import { observer } from 'mobx-react';
import React from 'react';
import { StyledTabBar, TabGroups, AddTabButton } from './styles';
import Store from '../../store';
import TabGroup from '../TabGroup';
import ToolbarButton from '../ToolbarButton';

const addTabIcon = require('../../../shared/icons/actions/add.svg');

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

    return (
      <StyledTabBar
        style={{ ...theme.tabbar.style }}
        visible={!Store.addressBar.toggled}
        innerRef={(r: any) => (this.tabBar = r)}
      >
        <TabGroups>
          {Store.tabGroups.map(tabGroup => <TabGroup key={tabGroup.id} tabGroup={tabGroup} />)}
          <AddTabButton
            icon={addTabIcon}
            onClick={this.onAddTabButtonClick}
            style={{ ...theme.addTabButton.style }}
            divRef={r => (Store.addTabButton.ref = r)}
          />
        </TabGroups>
      </StyledTabBar>
    );
  }
}
