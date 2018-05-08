import React from 'react';
import { observer } from 'mobx-react';
import Toolbar from '../Toolbar';
import LeftMenu from '../LeftMenu';
import { StyledPageLayout, Content } from './styles';

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
        <Content>{this.props.children}</Content>
      </StyledPageLayout>
    );
  }
}
