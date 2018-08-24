import { observer } from 'mobx-react';
import React from 'react';

import { transparency, icons } from '~/renderer/defaults';
import { Bookmark } from '~/interfaces';
import { Icon, PageItem } from '@components/PageItem';
import { ActionIcon, Input, Title } from './styles';
import store from '@app/store';
import { databases } from '~/defaults/databases';

export interface Props {
  data: Bookmark;
}

@observer
export default class BookmarkItem extends React.Component<Props> {
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

    const { bookmarksStore } = store;
    const { selectedItems } = bookmarksStore;

    if (this.cmdPressed || e.ctrlKey) {
      if (selectedItems.indexOf(data._id) === -1) {
        selectedItems.push(data._id);
      } else {
        selectedItems.splice(selectedItems.indexOf(data._id), 1);
      }
    } else if (data.type === 'folder') {
      bookmarksStore.goToFolder(data._id);
    } else {
      store.tabsStore.addTab({ url: data.url });
      store.menuStore.hide();
    }
  };

  public onMouseEnter = () => {
    this.props.data.hovered = true;
  };

  public onMouseLeave = () => {
    this.props.data.hovered = false;
  };

  public onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.stopPropagation();

    const { data } = this.props;
    store.bookmarksStore.removeItem(data);
  };

  public onTitleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { data } = this.props;

    e.preventDefault();
    e.stopPropagation();

    data.inputVisible = true;
    this.input.value = data.title;
    this.input.focus();

    window.addEventListener('mousedown', this.onWindowMouseDown);
  };

  public onInputMouseEvent = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  public onWindowMouseDown = () => {
    this.props.data.inputVisible = false;
    this.saveName();

    window.removeEventListener('mousedown', this.onWindowMouseDown);
  };

  public onInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.onWindowMouseDown();
    }
  };

  public saveName = async () => {
    const { data } = this.props;
    const title = this.input.value;

    if (title !== data.title && title.length > 0) {
      databases.bookmarks.update(
        {
          _id: data._id,
        },
        {
          $set: {
            title,
          },
        },
        {},
        (err: any) => {
          if (err) return console.warn(err);

          data.title = title;
        },
      );
    }
  };

  public onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  public render() {
    const { data } = this.props;

    const isFolder = data.type === 'folder';
    let opacity = 1;
    let favicon = store.faviconsStore.favicons[data.favicon];

    if (favicon == null || favicon.trim() === '') {
      favicon = isFolder ? icons.folder : icons.page;
      opacity = transparency.light.inactiveIcon;
    }

    return (
      <PageItem
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
        selected={store.bookmarksStore.selectedItems.indexOf(data._id) !== -1}
      >
        <Icon style={{ opacity }} icon={favicon} />
        <div style={{ flex: 1 }}>
          <Title onClick={this.onTitleClick}>{data.title}</Title>
        </div>
        <Input
          innerRef={r => (this.input = r)}
          visible={data.inputVisible}
          onClick={this.onInputMouseEvent}
          onFocus={this.onInputFocus}
          onMouseDown={this.onInputMouseEvent}
          onKeyPress={this.onInputKeyPress}
          placeholder="Name"
        />
        <ActionIcon
          icon={icons.delete}
          onClick={this.onRemoveClick}
          visible={data.hovered}
        />
      </PageItem>
    );
  }
}
