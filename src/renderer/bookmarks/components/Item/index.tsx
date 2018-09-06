import { observer } from 'mobx-react';
import React from 'react';

import store from '@bookmarks/store';
import { transparency, icons } from '~/shared/constants/renderer';
import { Bookmark } from '~/shared/interfaces';
import { Icon, PageItem } from '~/shared/components/PageItem';
import { ActionIcon, Title } from './styles';

export interface Props {
  data: Bookmark;
}

@observer
export default class BookmarkItem extends React.Component<Props> {
  public onMouseEnter = () => {
    this.props.data.hovered = true;
  };

  public onMouseLeave = () => {
    this.props.data.hovered = false;
  };

  public onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.stopPropagation();

    console.log('remove');
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
      <PageItem
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        selected={selected}
      >
        <Icon style={{ opacity }} icon={favicon} />
        <div style={{ flex: 1 }}>
          <Title>{data.title}</Title>
        </div>
        <ActionIcon
          icon={icons.delete}
          onClick={this.onRemoveClick}
          visible={data.hovered}
        />
      </PageItem>
    );
  }
}
