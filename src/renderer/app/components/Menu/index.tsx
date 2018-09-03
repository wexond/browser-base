import { observer } from 'mobx-react';
import React from 'react';

import store from '@app/store';
import MenuItem from '../MenuItem';
import { icons } from '@/constants/renderer';
import { Container, Separator } from './styles';

interface Props {
  children?: any;
  title?: string;
}

@observer
export default class extends React.Component<Props, {}> {
  public openTab = (page: string) => {
    store.tabsStore.addTab({
      url: `http://localhost:8080/${page}.html`,
      active: true,
    });
  };

  public onHistoryClick = () => {
    this.openTab('history');
  };

  public onDownloadsClick = () => {
    this.openTab('downloads');
  };

  public onBookmarksClick = () => {
    this.openTab('bookmarks');
  };

  public onExtensionsClick = () => {
    this.openTab('extensions');
  };

  public onSettingsClick = () => {
    this.openTab('settings');
  };

  public onAboutClick = () => {
    this.openTab('about');
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
        <MenuItem
          title="Downloads"
          icon={icons.download}
          onClick={this.onDownloadsClick}
        />
        <MenuItem
          title="Bookmarks"
          icon={icons.bookmarks}
          onClick={this.onBookmarksClick}
        />
        <Separator visible={true} />
        <MenuItem
          title="Extensions"
          icon={icons.extensions}
          onClick={this.onExtensionsClick}
        />
        <MenuItem
          title="Settings"
          icon={icons.settings}
          onClick={this.onSettingsClick}
        />
        <Separator visible={true} />
        <MenuItem title="About" icon={icons.info} onClick={this.onAboutClick} />
      </Container>
    );
  }
}
