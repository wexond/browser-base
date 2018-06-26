import { observer } from 'mobx-react';
import React from 'react';
import { StyledTabBar, Workspaces, AddTabButton } from './styles';
import Store from '../../store';
import Workspace from '../Workspace';

const addTabIcon = require('../../../shared/icons/add.svg');

@observer
export default class TabBar extends React.Component<{}, {}> {
  private tabBar: HTMLDivElement;

  public componentDidMount() {
    Store.getTabBarWidth = () => this.tabBar.offsetWidth;
  }

  public onAddTabButtonClick = () => {
    Store.getCurrentWorkspace().addTab();
  };

  public render() {
    const { tabs } = Store.getCurrentWorkspace();

    return (
      <StyledTabBar visible={!Store.addressBar.toggled} innerRef={(r: any) => (this.tabBar = r)}>
        <Workspaces>
          {Store.workspaces.map(workspace => (
            <Workspace key={workspace.id} workspace={workspace} />
          ))}
          <AddTabButton
            icon={addTabIcon}
            onClick={this.onAddTabButtonClick}
            divRef={r => (Store.addTabButton.ref = r)}
          />
        </Workspaces>
      </StyledTabBar>
    );
  }
}
