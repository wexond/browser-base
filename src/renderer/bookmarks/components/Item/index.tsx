import { observer } from 'mobx-react';
import React from 'react';

import store from '@bookmarks/store';
import { transparency, icons } from '~/shared/constants/renderer';
import { Bookmark } from '~/shared/interfaces';
import { Icon } from '~/shared/components/PageItem';
import { Root, ActionIcon, Title, Input, Divider } from './styles';

export interface Props {
  data: Bookmark;
}

declare const global: any;

@observer
export default class BookmarkItem extends React.Component<Props> {
  private input: HTMLInputElement;

  private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (store.cmdPressed || e.ctrlKey) {
      e.preventDefault();

      const { data } = this.props;
      const index = store.selectedItems.indexOf(data._id);

      if (index === -1) {
        store.selectedItems.push(data._id);
      } else {
        store.selectedItems.splice(index, 1);
      }
    }
  };

  private onDoubleClick = () => {
    const { data } = this.props;

    if (data.type === 'folder') {
      store.goToFolder(data._id);
    }
  };

  private onMouseEnter = () => {
    if (!store.draggedVisible) return;
    const { data } = this.props;

    if (data.type === 'item') {
      const index = store.bookmarks.indexOf(data);
      const draggedIndex = store.bookmarks.indexOf(store.dragged);

      store.dividerPos = index < draggedIndex ? 'top' : 'bottom';
    } else {
      store.dividerPos = null;
    }

    store.hovered = data === store.dragged ? null : data;
  };

  private onTitleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const { data } = this.props;

    this.props.data.inputVisible = true;
    this.input.value = data.title;
    this.input.focus();
    this.input.select();
  };

  private onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const { data } = this.props;
    global.wexondPages.bookmarks.delete(data._id);
  };

  private save = (e: any) => {
    const { data } = this.props;
    const value = this.input.value;

    if (e.type === 'keydown' && e.key !== 'Escape' && e.key !== 'Enter') {
      return;
    }

    data.inputVisible = false;

    if (value.length !== 0) {
      global.wexondPages.bookmarks.edit(
        data._id,
        this.input.value,
        data.parent,
      );
    }
  };

  public render() {
    const { data } = this.props;
    const isFolder = data.type === 'folder';

    let opacity = 1;
    let favicon = data.favicon; // TODO

    if (favicon == null || favicon.trim() === '') {
      favicon = isFolder ? icons.folder : icons.page;
      opacity = transparency.light.inactiveIcon;
    }

    const selected = store.selectedItems.indexOf(data._id) !== -1;

    return (
      <Root
        selected={selected}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        onMouseDown={() => (store.dragged = this.props.data)}
        onMouseEnter={this.onMouseEnter}
      >
        <Icon icon={favicon} style={{ opacity }} />
        <Title
          onClick={this.onTitleClick}
          onMouseDown={e => e.stopPropagation()}
        >
          {data.title}
        </Title>
        <Input
          placeholder="Name"
          innerRef={r => (this.input = r)}
          onBlur={this.save}
          onKeyDown={this.save}
          visible={data.inputVisible}
          onClick={e => e.preventDefault()}
          onMouseDown={e => e.stopPropagation()}
        />
        <ActionIcon
          className="DELETE-ICON"
          icon={icons.delete}
          onClick={this.onRemoveClick}
          onMouseDown={e => e.stopPropagation()}
        />
        {store.hovered === data &&
          store.dividerPos != null && <Divider pos={store.dividerPos} />}
      </Root>
    );
  }
}
