import * as React from 'react';
import { observer } from 'mobx-react';

import { StyledBookmarkTile, Title, Icon, PageIcon, Content } from './styles';
import { Bookmark } from '@/interfaces';
import store from '@app/store';
import { icons, transparency } from '@/constants/renderer';

interface Props {
  data: Bookmark;
}

@observer
export default class BookmarkTile extends React.Component<Props> {
  public onClick = () => {
    store.pagesStore.getSelected().url = this.props.data.url;
    store.addressBarStore.toggled = false;
  };

  public render() {
    const { title } = this.props.data;
    const favicon = store.faviconsStore.favicons[this.props.data.favicon];

    let pageIcon = false;

    if (favicon === '' || !favicon) {
      pageIcon = true;
    }

    return (
      <StyledBookmarkTile onClick={this.onClick}>
        <Content>
          {(!pageIcon && (
            <Icon style={{ backgroundImage: `url(${favicon})` }} />
          )) || <PageIcon />}
          <Title>{title}</Title>
        </Content>
      </StyledBookmarkTile>
    );
  }
}
