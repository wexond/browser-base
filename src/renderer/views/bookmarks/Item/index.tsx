import { observer } from 'mobx-React';
import React from 'react';

import database from '../../../../database';
import { icons, opacity } from '../../../../defaults';
import { BookmarkItem } from '../../../../interfaces';
import { createTab, removeItem } from '../../../../utils';
import { Icon, Root } from '../../../components/PageItem';
import store from '../../../store';
import { ActionIcon, Input, Title } from './styles';

export interface IState {
  hovered: boolean;
  inputVisible: boolean;
}

@observer
export default class Item extends React.Component<
  { data: BookmarkItem },
  IState
> {
  public state: IState = {
    hovered: false,
    inputVisible: false,
  };

  private cmdPressed = false;

  private input: HTMLInputElement;

  public componentDidMount() {
    window.addEventListener('keydown', e => {
      this.cmdPressed = e.key === 'Meta'; // Command on macOS
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'Meta') {
        this.cmdPressed = false;
      }
    });
  }

  public onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { data } = this.props;

    if (this.cmdPressed || e.ctrlKey) {
      if (store.selectedBookmarkItems.indexOf(data.id) === -1) {
        store.selectedBookmarkItems.push(data.id);
      } else {
        store.selectedBookmarkItems.splice(
          store.selectedBookmarkItems.indexOf(data.id),
          1,
        );
      }
    } else if (data.type === 'folder') {
      store.goToBookmarkFolder(data.id);
    } else {
      createTab({ url: data.url });
      store.menu.hide();
    }
  }

  public onMouseEnter = () => this.setState({ hovered: true });

  public onMouseLeave = () => this.setState({ hovered: false });

  public onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.stopPropagation();

    const { data } = this.props;
    const { id, type } = data;

    removeItem(id, type);
  }

  public onTitleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { data } = this.props;

    e.preventDefault();
    e.stopPropagation();

    this.setState({ inputVisible: true });
    this.input.value = data.title;
    this.input.focus();

    window.addEventListener('mousedown', this.onWindowMouseDown);
  }

  public onInputMouseEvent = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  }

  public onWindowMouseDown = () => {
    this.setState({ inputVisible: false });
    this.saveFolderName();

    window.removeEventListener('mousedown', this.onWindowMouseDown);
  }

  public onInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.onWindowMouseDown();
    }
  }

  public saveFolderName = async () => {
    const { data } = this.props;

    const title = this.input.value;

    if (title !== data.title && title.length > 0) {
      await database.bookmarks
        .where('id')
        .equals(data.id)
        .modify({
          title,
        });

      const item = store.bookmarks.find(x => x.id === data.id);
      item.title = title;
    }
  }

  public onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  }

  public render() {
    const { data } = this.props;
    const { hovered, inputVisible } = this.state;

    const isFolder = data.type === 'folder';
    let transparency = 1;
    let favicon = store.favicons[data.favicon];

    if (favicon == null || favicon.trim() === '') {
      favicon = isFolder ? icons.folder : icons.page;
      transparency = opacity.light.inactiveIcon;
    }

    return (
      <Root
        onFocus={() => null}
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
        selected={store.selectedBookmarkItems.indexOf(data.id) !== -1}
      >
        <Icon style={{ opacity: transparency }} icon={favicon} />
        <div style={{ flex: 1 }}>
          <Title onClick={this.onTitleClick}>{data.title}</Title>
        </div>
        <Input
          innerRef={r => (this.input = r)}
          visible={inputVisible}
          onClick={this.onInputMouseEvent}
          onFocus={this.onInputFocus}
          onMouseDown={this.onInputMouseEvent}
          onKeyPress={this.onInputKeyPress}
          placeholder="Name"
        />
        <ActionIcon
          icon={icons.delete}
          onClick={this.onRemoveClick}
          visible={hovered}
        />
      </Root>
    );
  }
}
