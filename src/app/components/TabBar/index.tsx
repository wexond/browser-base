import { observer } from 'mobx-react'; // eslint-disable-line no-unused-vars
import React from 'react';

// Components
import TabGroup from '../TabGroup';
import ToolBarButton from '../ToolBarButton';

// Styles
import { StyledTabBar, TabGroups } from './styles';

// Enums
import { Icons } from '../../enums';

import Store from '../../store';

@observer
export default class TabBar extends React.Component<{}, {}> {
  private tabBar: HTMLDivElement;
  private addTabButton: HTMLDivElement;

  public componentDidMount() {
    Store.getTabBarWidth = this.getTabBarWidth;
  }

  public getTabBarWidth = () => this.tabBar.offsetWidth;

  public onAddTabButtonClick = () => {
    Store.getCurrentTabGroup().addTab();
  };

  public render() {
    return (
      <StyledTabBar visible={!Store.addressBar.toggled} innerRef={(r: any) => (this.tabBar = r)}>
        <TabGroups>
          {Store.tabGroups.map(tabGroup => <TabGroup key={tabGroup.id} tabGroup={tabGroup} />)}
          <ToolBarButton
            icon={Icons.AddTab}
            onClick={this.onAddTabButtonClick}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
            }}
            innerRef={(r) => {
              this.addTabButton = r;
              Store.addTabButton.ref = r;
            }}
          />
        </TabGroups>
      </StyledTabBar>
    );
  }
}
