import { observer } from 'mobx-react';
import React from 'react';
import { StyledTabBar } from './styles';
import Workspace from '../Workspace';
import store from '../../../store';

@observer
export default class TabBar extends React.Component<{}, {}> {
  private tabBar: HTMLDivElement;

  public render() {
    const { tabs } = store.getCurrentWorkspace();

    return (
      <StyledTabBar visible={!store.addressBar.toggled} innerRef={(r: any) => (this.tabBar = r)}>
        {store.workspaces.map(workspace => (
          <Workspace key={workspace.id} workspace={workspace} />
        ))}
      </StyledTabBar>
    );
  }
}
