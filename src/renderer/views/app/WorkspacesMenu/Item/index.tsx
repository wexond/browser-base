import { observer } from 'mobx-react';
import React from 'react';

import Store from '../../../store';
import Workspace from '../../../models/workspace';

import {
  Root, IconsContainer, Icon, Label, DeleteIcon, Input,
} from './styles';

export interface IProps {
  workspace: Workspace;
}

export interface IState {
  inputVisible: boolean;
}

@observer
export default class extends React.Component<IProps, IState> {
  public static defaultProps = {
    selected: false,
  };

  public state: IState = {
    inputVisible: false,
  };

  private input: HTMLInputElement;

  public onClick = () => {
    const { workspace } = this.props;
    const { workspaces } = Store;

    workspaces.selected = workspace.id;
  };

  public onDelete = (e?: React.MouseEvent<HTMLDivElement>) => {
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

  public onLabelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    this.toggleInput(true);
  };

  public onInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  public onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    this.toggleInput(false);
  };

  public onInputKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.toggleInput(false);
    }
  };

  public toggleInput = (flag: boolean) => {
    const { workspace } = this.props;

    if (flag) {
      this.input.value = workspace.name;
      this.input.select();
    } else {
      const value = this.input.value;

      if (value.length > 0) {
        this.input.value = value;
        workspace.name = value;
      }
    }

    this.setState({ inputVisible: flag });
    Store.workspaces.inputVisible = flag;
  };

  public render() {
    const { workspace } = this.props;
    const { inputVisible } = this.state;
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
        <Label onClick={this.onLabelClick}>{workspace.name}</Label>
        <Input
          innerRef={r => (this.input = r)}
          visible={inputVisible}
          onClick={this.onInputClick}
          onBlur={this.onInputBlur}
          onKeyPress={this.onInputKeypress}
        />
      </Root>
    );
  }
}
