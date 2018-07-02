import { observer } from 'mobx-react';
import React from 'react';

import {
  Root, IconsContainer, Icon, Label, DeleteIcon,
} from './styles';

import Store from '../../../store';
import Workspace from '../../../models/workspace';

export interface Props {
  workspace: Workspace;
}

@observer
export default class extends React.Component<Props, {}> {
  public static defaultProps = {
    selected: false,
  };

  public onClick = () => {
    const { workspace } = this.props;
    const { workspaces } = Store;

    workspaces.selected = workspace.id;
  };

  public onDelete = (e?: React.SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const { workspace } = this.props;
    const { workspaces } = Store;

    if (workspaces.list.length > 0) {
      let altWorkspaceIndex = workspaces.list.indexOf(workspace) + 1;

      if (altWorkspaceIndex === workspaces.list.length) {
        altWorkspaceIndex = workspaces.list.indexOf(workspace) - 1;
      }

      const altWorkspace = workspaces.list[altWorkspaceIndex];

      for (const tab of workspace.tabs) {
        Store.pages.splice(Store.pages.indexOf(Store.getPageById(tab.id)), 1);
      }

      workspaces.selected = altWorkspace.id;
      workspace.remove();
    }
  };

  public render() {
    const { workspace } = this.props;
    const { workspaces } = Store;

    const selected = workspaces.selected === workspace.id;
    const icons = workspace.getIcons();

    return (
      <Root onClick={this.onClick}>
        {workspaces.list.length > 1 && (
          <DeleteIcon className="delete-icon" onClick={this.onDelete} />
        )}
        <IconsContainer selected={selected}>
          {icons != null && icons.map((data: any, key: any) => <Icon key={key} src={data} />)}
        </IconsContainer>
        <Label>{workspace.name}</Label>
      </Root>
    );
  }
}
