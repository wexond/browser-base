import { observer } from 'mobx-react';
import React from 'react';

import store from '@app/store';
import ContextMenuSeparator from '@components/ContextMenuSeparator';
import MenuItem from '../MenuItem';
import { Container, Separator } from './styles';
import { icons } from '~/renderer/defaults';

interface Props {
  children?: any;
  title?: string;
}

@observer
export default class extends React.Component<Props, {}> {
  public onHistoryClick = () => {
    store.tabsStore.addTab({
      url: 'http://localhost:8080/history.html',
      active: true,
    });
  };

  public onAboutClick = () => {
    store.tabsStore.addTab({
      url: 'http://localhost:8080/about.html',
      active: true,
    });
  };

  public render() {
    return (
      <Container
        onMouseDown={e => e.stopPropagation()}
        visible={store.menuStore.visible}
      >
        <MenuItem
          title="History"
          icon={icons.history}
          onClick={this.onHistoryClick}
        />
        <MenuItem title="Downloads" icon={icons.download} />
        <MenuItem title="Bookmarks" icon={icons.bookmarks} />
        <Separator visible={true} />
        <MenuItem title="Extensions" icon={icons.extensions} />
        <MenuItem title="Settings" icon={icons.settings} />
        <Separator visible={true} />
        <MenuItem title="About" icon={icons.info} onClick={this.onAboutClick} />
      </Container>
    );
  }
}
