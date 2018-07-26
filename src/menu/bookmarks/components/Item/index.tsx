import { observer } from 'mobx-react';
import React from 'react';
import transparency from '../../../../shared/defaults/opacity';
import AppStore from '../../../../app/store';
import Store from '../../store';
import BookmarkItem from '../../../../shared/models/bookmark-item';
import { removeItem } from '../../utils';
import { Root, Icon } from '../../../../shared/components/PageItem';
import db from '../../../../shared/models/app-database';
import { Title, Input, ActionIcon } from './styles';

const pageIcon = require('../../../../shared/icons/page.svg');
const folderIcon = require('../../../../shared/icons/folder.svg');
const deleteIcon = require('../../../../shared/icons/delete.svg');

export interface IProps {
  data: BookmarkItem;
}

export interface IState {
  hovered: boolean;
  inputVisible: boolean;
}

@observer
export default class Item extends React.Component<IProps, IState> {
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
      if (Store.selectedItems.indexOf(data.id) === -1) {
        Store.selectedItems.push(data.id);
      } else {
        Store.selectedItems.splice(Store.selectedItems.indexOf(data.id), 1);
      }
    } else if (data.type === 'folder') {
      Store.goTo(data.id);
    } else {
      AppStore.getCurrentWorkspace().addTab(data.url);
      AppStore.menu.hide();
    }
  };

  public onMouseEnter = () => this.setState({ hovered: true });

  public onMouseLeave = () => this.setState({ hovered: false });

  public onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.stopPropagation();

    const { data } = this.props;
    const { id, type } = data;

    removeItem(id, type);
  };

  public onTitleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { data } = this.props;

    e.preventDefault();
    e.stopPropagation();

    this.setState({ inputVisible: true });
    this.input.value = data.title;
    this.input.focus();

    window.addEventListener('mousedown', this.onWindowMouseDown);
  };

  public onInputMouseEvent = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  public onWindowMouseDown = () => {
    this.setState({ inputVisible: false });
    this.saveFolderName();

    window.removeEventListener('mousedown', this.onWindowMouseDown);
  };

  public onInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.onWindowMouseDown();
    }
  };

  public saveFolderName = async () => {
    const { data } = this.props;

    const title = this.input.value;

    if (title !== data.title && title.length > 0) {
      await db.bookmarks
        .where('id')
        .equals(data.id)
        .modify({
          title,
        });

      const item = AppStore.bookmarks.find(x => x.id === data.id);
      item.title = title;
    }
  };

  public onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  public render() {
    const { data } = this.props;
    const { hovered, inputVisible } = this.state;

    const isFolder = data.type === 'folder';
    let opacity = 1;
    let favicon = AppStore.favicons[data.favicon];

    if (favicon == null || favicon.trim() === '') {
      favicon = isFolder ? folderIcon : pageIcon;
      opacity = transparency.light.inactiveIcon;
    }

    return (
      <Root
        onFocus={() => null}
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
        selected={Store.selectedItems.indexOf(data.id) !== -1}
      >
        <Icon style={{ opacity }} icon={favicon} />
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
        <ActionIcon icon={deleteIcon} onClick={this.onRemoveClick} visible={hovered} />
      </Root>
    );
  }
}
