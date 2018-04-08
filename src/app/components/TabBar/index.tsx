import { observer } from 'mobx-react';
import React from 'react';
import { StyledTabBar, TabGroups } from './styles';
import { Icons } from '../../enums';
import Store from '../../store';
import TabGroup from '../TabGroup';
import ToolBarButton from '../ToolBarButton';

@observer
export default class TabBar extends React.Component<{}, {}> {
  private tabBar: HTMLDivElement;

  public componentDidMount() {
    Store.getTabBarWidth = this.getTabBarWidth;
  }

  public getTabBarWidth = () => this.tabBar.offsetWidth;

  public onAddTabButtonClick = () => {
    Store.getCurrentTabGroup().addTab();
  };

  public render() {
    return (
      <StyledTabBar
        style={{ ...Store.theme.theme.tabbar.style }}
        visible={!Store.addressBar.toggled}
        innerRef={(r: any) => (this.tabBar = r)}
      >
        <TabGroups>
          {Store.tabGroups.map(tabGroup => <TabGroup key={tabGroup.id} tabGroup={tabGroup} />)}
          <ToolBarButton
            icon={Icons.AddTab}
            onClick={this.onAddTabButtonClick}
            style={{
              ...Store.theme.theme.addTabButton.style,
              position: 'absolute',
              right: 0,
              top: 0,
              left: 0,
            }}
            innerRef={r => {
              Store.addTabButton.ref = r;
            }}
          />
        </TabGroups>
      </StyledTabBar>
    );
  }
}
