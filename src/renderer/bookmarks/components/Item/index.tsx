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

  public onTitleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const { data } = this.props;

    this.props.data.inputVisible = true;
    this.input.value = data.title;
    this.input.focus();
    this.input.select();
  };

  public onInputBlur = () => {
    this.props.data.inputVisible = false;
    console.log(this.input.value);
  };

  public onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
      <Root href={isFolder ? null : data.url} selected={selected}>
        <Icon icon={favicon} style={{ opacity }} />
        <div style={{ flex: 1 }}>
          <Title onClick={this.onTitleClick}>{data.title}</Title>
        </div>
        <Input
          placeholder="Name"
          innerRef={r => (this.input = r)}
          onBlur={this.onInputBlur}
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
