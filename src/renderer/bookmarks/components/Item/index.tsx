import { observer } from 'mobx-react';
import React from 'react';

import store from '@bookmarks/store';
import { transparency, icons } from '~/shared/constants/renderer';
import { Bookmark } from '~/shared/interfaces';
import { Icon } from '~/shared/components/PageItem';
import { Root, ActionIcon, Title, Input } from './styles';

export interface Props {
  data: Bookmark;
}

declare const global: any;

@observer
export default class BookmarkItem extends React.Component<Props> {
  private input: HTMLInputElement;

  private onClick = () => {
    const { data } = this.props;

    if (data.type === 'folder') {
      store.goToFolder(data._id);
    }
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

  private onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const { data } = this.props;
    global.wexondPages.bookmarks.delete(data._id);
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
        href={isFolder ? null : data.url}
        selected={selected}
        onClick={this.onClick}
      >
        <Icon icon={favicon} style={{ opacity }} />
        <div style={{ flex: 1 }}>
          <Title onClick={this.onTitleClick}>{data.title}</Title>
        </div>
        <Input
          placeholder="Name"
          innerRef={r => (this.input = r)}
          onBlur={this.save}
          onKeyDown={this.save}
          visible={data.inputVisible}
          onClick={e => e.preventDefault()}
        />
        <ActionIcon
          className="DELETE-ICON"
          icon={icons.delete}
          onClick={this.onRemoveClick}
        />
      </Root>
    );
  }
}
