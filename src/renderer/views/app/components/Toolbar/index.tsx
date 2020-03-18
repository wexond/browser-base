import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ipcRenderer, remote } from 'electron';
import { parse } from 'url';

import store from '../../store';
import { Buttons, StyledToolbar, Separator, Addressbar } from './style';
import { NavigationButtons } from '../NavigationButtons';
import { ToolbarButton } from '../ToolbarButton';
import { BrowserAction } from '../BrowserAction';
import {
  ICON_STAR,
  ICON_STAR_FILLED,
  ICON_KEY,
  ICON_SHIELD,
  ICON_DOWNLOAD,
  ICON_INCOGNITO,
  ICON_MORE,
} from '~/renderer/constants/icons';
import { isDialogVisible } from '../../utils/dialogs';

const onDownloadsClick = async (e: React.MouseEvent<HTMLDivElement>) => {
  const { right, bottom } = e.currentTarget.getBoundingClientRect();
  if (!(await isDialogVisible('downloadsDialog'))) {
    store.downloadNotification = false;
    ipcRenderer.send(`show-downloads-dialog-${store.windowId}`, right, bottom);
  }
};

const onKeyClick = () => {
  const { hostname } = parse(store.tabs.selectedTab.url);
  const list = store.autoFill.credentials.filter(
    r => r.url === hostname && r.fields.username,
  );

  ipcRenderer.send(`credentials-show-${store.windowId}`, {
    content: 'list',
    list,
  });
};

let starRef: HTMLDivElement = null;
let menuRef: HTMLDivElement = null;

const showAddBookmarkDialog = async () => {
  if (!(await isDialogVisible('addBookmarkDialog'))) {
    const { right, bottom } = starRef.getBoundingClientRect();
    ipcRenderer.send(
      `show-add-bookmark-dialog-${store.windowId}`,
      right,
      bottom,
    );
  }
};

const showMenuDialog = async () => {
  if (!(await isDialogVisible('menuDialog'))) {
    const { right, bottom } = menuRef.getBoundingClientRect();
    ipcRenderer.send(`show-menu-dialog-${store.windowId}`, right, bottom);
  }
};

ipcRenderer.on('show-add-bookmark-dialog', () => {
  showAddBookmarkDialog();
});

ipcRenderer.on('show-menu-dialog', () => {
  showMenuDialog();
});

const onStarClick = (e: React.MouseEvent<HTMLDivElement>) => {
  showAddBookmarkDialog();
};

const onMenuClick = async () => {
  showMenuDialog();
};

const BrowserActions = observer(() => {
  const { selectedTabId } = store.tabs;

  return (
    <>
      {selectedTabId &&
        store.extensions.browserActions.map(item => {
          if (item.tabId === selectedTabId) {
            return <BrowserAction data={item} key={item.extensionId} />;
          }
          return null;
        })}
    </>
  );
});

const onShieldContextMenu = (e: React.MouseEvent) => {
  const menu = remote.Menu.buildFromTemplate([
    {
      checked: store.settings.object.shield,
      label: 'Enabled',
      type: 'checkbox',
      click: () => {
        store.settings.object.shield = !store.settings.object.shield;
        store.settings.save();
      },
    },
  ]);

  menu.popup();
};

const RightButtons = observer(() => {
  const { selectedTab } = store.tabs;

  let blockedAds = 0;
  let hasCredentials = false;

  if (selectedTab) {
    blockedAds = selectedTab.blockedAds;
    hasCredentials = selectedTab.hasCredentials;
  }

  return (
    <Buttons>
      <BrowserActions />
      {store.extensions.browserActions.length > 0 && <Separator />}
      <ToolbarButton
        divRef={r => (starRef = r)}
        toggled={store.dialogsVisibility['add-bookmark']}
        icon={store.isBookmarked ? ICON_STAR_FILLED : ICON_STAR}
        size={18}
        onMouseDown={onStarClick}
      />
      {hasCredentials && (
        <ToolbarButton icon={ICON_KEY} size={16} onClick={onKeyClick} />
      )}

      <ToolbarButton
        size={16}
        badge={store.settings.object.shield && blockedAds > 0}
        badgeText={blockedAds.toString()}
        icon={ICON_SHIELD}
        opacity={store.settings.object.shield ? 0.87 : 0.54}
        onContextMenu={onShieldContextMenu}
      ></ToolbarButton>

      {store.downloadsButtonVisible && (
        <ToolbarButton
          size={18}
          badge={store.downloadNotification}
          onMouseDown={onDownloadsClick}
          toggled={store.dialogsVisibility['downloads-dialog']}
          icon={ICON_DOWNLOAD}
          badgeTop={9}
          badgeRight={9}
          preloader
          value={store.downloadProgress}
        ></ToolbarButton>
      )}
      <Separator />
      {store.isIncognito && <ToolbarButton icon={ICON_INCOGNITO} size={18} />}
      <ToolbarButton
        divRef={r => (menuRef = r)}
        toggled={store.dialogsVisibility['menu']}
        badge={store.updateAvailable}
        badgeRight={10}
        badgeTop={8}
        onMouseDown={onMenuClick}
        icon={ICON_MORE}
        size={18}
      />
    </Buttons>
  );
});

export const Toolbar = observer(() => {
  return (
    <StyledToolbar>
      <NavigationButtons />
      <Addressbar />
      <RightButtons />
    </StyledToolbar>
  );
});
