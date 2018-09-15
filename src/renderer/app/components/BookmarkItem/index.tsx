import React from 'react';
import { StyledBookmarkItem, Icon, Title } from './styles';
import { Bookmark } from '@/interfaces';
import { observer } from 'mobx-react';
import store from '@app/store';
import { icons, transparency } from '@/constants/renderer';

interface Props {
  item: Bookmark;
}

@observer
export default class BookmarkItem extends React.Component<Props> {
  public onClick = () => {
    store.pagesStore.getSelected().url = this.props.item.url;
  };

  public render() {
    const { title, favicon, type } = this.props.item;

    let icon = favicon;
    let opacity = 1;

    if (type === 'folder') {
      icon = icons.folder;
      opacity = transparency.light.inactiveIcon;
    }

    return (
      <StyledBookmarkItem onClick={this.onClick}>
        <Icon
          style={{
            backgroundImage: `url(${icon})`,
            marginRight: icon == null ? 0 : 8,
            minWidth: icon == null ? 0 : 16,
            opacity,
          }}
        />
        <Title>{title}</Title>
      </StyledBookmarkItem>
    );
  }
}
