import React from 'react';

import {
  Root, IconsContainer, Icon, Label,
} from './styles';

import Store from '../../../store';
import Workspace from '../../../models/workspace';

export interface Props {
  workspace: Workspace;
}

export default class extends React.Component<Props, {}> {
  public static defaultProps = {
    selected: false,
  };

  public onClick = () => {
    const { workspace } = this.props;
    const { workspaces } = Store;

    workspaces.selected = workspace.id;
  };

  public render() {
    const { workspace } = this.props;
    const { workspaces } = Store;

    const selected = workspaces.selected === workspace.id;
    const icons = workspace.getIcons();

    return (
      <Root onClick={this.onClick}>
        <IconsContainer selected={selected}>
          {icons != null && icons.map((data: any, key: any) => <Icon key={key} src={data} />)}
        </IconsContainer>
        <Label>{workspace.name}</Label>
      </Root>
    );
  }
}
