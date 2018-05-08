import React from 'react';
import { observer } from 'mobx-react';
import Toolbar from '../Toolbar';
import LeftMenu from '../LeftMenu';
import { StyledPageLayout, Content } from './styles';
import Store from '../../store';

const clearIcon = require('../../../shared/icons/clear.svg');
const historyIcon = require('../../../shared/icons/history.svg');
const bookmarksIcon = require('../../../shared/icons/bookmarks.svg');
const settingsIcon = require('../../../shared/icons/settings.svg');
const extensionsIcon = require('../../../shared/icons/extensions.svg');

export interface IProps {
  title?: string;
  children?: any;
}

@observer
export default class PageLayout extends React.Component<IProps, {}> {
  private content: HTMLDivElement;
  private lastScroll = 0;

  public componentDidMount() {
    this.content.addEventListener('scroll', this.onScroll);
  }

  public componentWillUnmount() {
    this.content.removeEventListener('scroll', this.onScroll);
  }

  public onScroll = (e: Event) => {
    if (this.content.scrollTop < 64 && Store.toolbarHeight <= 128 && Store.toolbarHeight >= 64) {
      Store.toolbarHeight -= this.content.scrollTop - this.lastScroll;
      if (Store.toolbarHeight < 64) Store.toolbarHeight = 64;
      if (Store.toolbarHeight > 128) Store.toolbarHeight = 128;
    }
    if (this.content.scrollTop > 64) {
      Store.toolbarHeight = 64;
    }
    this.lastScroll = this.content.scrollTop;
    Store.toolbarSmallFontSize = this.content.scrollTop > 50;
  };

  public render() {
    const { title } = this.props;

    return (
      <StyledPageLayout>
        <LeftMenu title="Wexond">
          <LeftMenu.Item icon={historyIcon} selected={title === 'History'}>
            History
            <LeftMenu.Item icon={clearIcon}>Clear browsing history</LeftMenu.Item>
          </LeftMenu.Item>
          <LeftMenu.Item icon={bookmarksIcon} selected={title === 'Bookmarks'}>
            Bookmarks
          </LeftMenu.Item>
          <LeftMenu.Item icon={settingsIcon} selected={title === 'Settings'}>
            Settings
          </LeftMenu.Item>
          <LeftMenu.Item icon={extensionsIcon} selected={title === 'Extensions'}>
            Extensions
          </LeftMenu.Item>
        </LeftMenu>
        <Toolbar title={title} />
        <Content toolbarHeight={Store.toolbarHeight} innerRef={r => (this.content = r)}>
          {this.props.children}
        </Content>
      </StyledPageLayout>
    );
  }
}
