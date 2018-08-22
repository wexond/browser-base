import { observer } from 'mobx-react';
import React from 'react';
import { TabGroup } from '../../models';
import {
  StyledTabGroupItem,
  IconsContainer,
  Label,
  DeleteIcon,
  Input,
} from './styles';
import store from '@app/store';

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
    this.props.data.select();
  };

  public onDelete = (e?: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const { data } = this.props;
    const { groups } = store.tabsStore;
    const { pages } = store.pagesStore;

    if (groups.length > 0) {
      let altGroupIndex = groups.indexOf(data) + 1;

      if (altGroupIndex === groups.length) {
        altGroupIndex = groups.indexOf(data) - 1;
      }

      const altGroup = groups[altGroupIndex];

      for (const tab of data.tabs) {
        pages.splice(pages.indexOf(store.pagesStore.getById(tab.id)), 1);
      }

      altGroup.select();
      store.tabsStore.removeGroup(data.id);
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
    const { data } = this.props;

    if (flag) {
      this.input.value = data.name;
      this.input.select();
    } else {
      const value = this.input.value;

      if (value.length > 0) {
        this.input.value = value;
        data.name = value;
      }
    }

    data.inputVisible = flag;
  };

  public render() {
    const { data } = this.props;
    const { inputVisible } = data;
    const { groups } = store.tabsStore;

    const selected = data.isSelected;

    return (
      <StyledTabGroupItem onClick={this.onClick}>
        {groups.length > 1 && (
          <DeleteIcon className="delete-icon" onClick={this.onDelete} />
        )}
        <IconsContainer selected={selected} />
        <Label onClick={this.onLabelClick}>{data.name}</Label>
        <Input
          innerRef={r => (this.input = r)}
          visible={inputVisible}
          onClick={this.onInputClick}
          onBlur={this.onInputBlur}
          onKeyPress={this.onInputKeypress}
        />
      </StyledTabGroupItem>
    );
  }
}
