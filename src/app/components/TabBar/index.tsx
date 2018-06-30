import { observer } from 'mobx-react';
import React from 'react';
import { StyledTabBar } from './styles';
import Store from '../../store';
import Workspace from '../Workspace';

@observer
export default class TabBar extends React.Component<{}, {}> {
  private tabBar: HTMLDivElement;

  public render() {
    const { tabs } = Store.getCurrentWorkspace();

    return (
      <StyledTabBar visible={!Store.addressBar.toggled} innerRef={(r: any) => (this.tabBar = r)}>
        {Store.workspaces.list.map(workspace => (
          <Workspace key={workspace.id} workspace={workspace} />
        ))}
      </StyledTabBar>
    );
  }
}
