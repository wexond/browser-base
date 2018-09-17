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

    let icon = type === 'folder' ? icons.folder : icons.page;
    let opacity = transparency.light.inactiveIcon;

    if (favicon != null && favicon !== '') {
      icon = favicon;
      opacity = 1;
    }

    return (
      <StyledBookmarkItem onClick={this.onClick}>
        <Icon
          style={{
            backgroundImage: `url(${icon})`,
            opacity,
          }}
        />
        <Title>
          {title} {this.props.item.order}
        </Title>
      </StyledBookmarkItem>
    );
  }
}
