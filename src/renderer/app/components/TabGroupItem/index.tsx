import { observer } from 'mobx-react';
import React from 'react';
import { TabGroup } from '../../models';
import { StyledTabGroupItem, IconsContainer, Label } from './styles';

interface Props {
  data: TabGroup;
}

@observer
export default class TabGroupItem extends React.Component<Props, {}> {
  public static defaultProps = {
    selected: false,
  };

  private input: HTMLInputElement;

  public onClick = () => {
    // selectWorkspace(workspace.id);
  };

  public onDelete = (e?: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    /*
    const { tabGroup } = this.props;
    const tabGroupsStore = store.tabGroupsStore;
    const { tabGroups } = tabGroupsStore;

    if (tabGroups.length > 0) {
      let altWorkspaceIndex = tabGroups.indexOf(tabGroup) + 1;

      if (altWorkspaceIndex === tabGroups.length) {
        altWorkspaceIndex = tabGroups.indexOf(tabGroup) - 1;
      }

      const altWorkspace = tabGroups[altWorkspaceIndex];

      const tabs = getWorkspaceTabs(workspace.id);

      for (const tab of tabs) {
        store.pages.splice(store.pages.indexOf(getPageById(tab.id)), 1);
        store.tabs.splice(store.tabs.indexOf(tab), 1);
      }

      selectWorkspace(altWorkspace.id);
      removeWorkspace(workspace.id);
    }
    */
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
    /*const { tabGroup } = this.props;

    if (flag) {
      this.input.value = tabGroup.name;
      this.input.select();
    } else {
      const value = this.input.value;

      if (value.length > 0) {
        this.input.value = value;
        workspace.name = value;
      }
    }

    this.setState({ inputVisible: flag });*/
  };

  public render() {
    return (
      <StyledTabGroupItem onClick={this.onClick}>
        <IconsContainer selected={false} />
        <Label>Label</Label>
      </StyledTabGroupItem>
    );

    /*const { workspace } = this.props;
    const { inputVisible } = this.state;
    const { workspaces } = store;

    const selected = store.currentWorkspace === workspace.id;

    return (
      <Root onClick={this.onClick}>
        {workspaces.length > 1 && (
          <DeleteIcon className="delete-icon" onClick={this.onDelete} />
        )}
        <IconsContainer selected={selected}>
          {store.tabs.map((tab, key) => {
            if (tab.workspaceId === workspace.id) {
              const favicon = tab.favicon !== '' ? tab.favicon : pageIcon;
              return (
                <Icon
                  key={key}
                  src={favicon}
                  style={{
                    opacity:
                      tab.favicon === '' ? transparency.light.inactiveIcon : 1,
                  }}
                />
              );
            }
            return null;
          })}
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
    );*/
  }
}
