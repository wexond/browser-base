import * as React from 'react';
import { observer } from 'mobx-react-lite';

import {
  ICON_STAR,
  ICON_STAR_FILLED,
  ICON_KEY,
  ICON_MAGNIFY_PLUS,
  ICON_MAGNIFY_MINUS,
  ICON_SHIELD,
} from '~/renderer/constants/icons';
import { ipcRenderer, remote } from 'electron';
import { parse } from 'url';
import store from '../../store';
import { ToolbarButton } from '../ToolbarButton';

const showAddBookmarkDialog = async () => {
  const star = document.getElementById('star');
  const { right, bottom } = star.getBoundingClientRect();
  ipcRenderer.send(`show-add-bookmark-dialog-${store.windowId}`, right, bottom);
};

const showZoomDialog = async () => {
  if (store.zoomFactor != 1) {
    const zoom = document.getElementById('zoom');
    const { right, bottom } = zoom.getBoundingClientRect();
    ipcRenderer.send(`show-zoom-dialog-${store.windowId}`, right, bottom);
  }
};

const onStarClick = (e: React.MouseEvent<HTMLDivElement>) => {
  showAddBookmarkDialog();
};

const onZoomClick = (e: React.MouseEvent<HTMLDivElement>) => {
  showZoomDialog();
};

const onKeyClick = () => {
  const { hostname } = parse(store.tabs.selectedTab.url);
  const list = store.autoFill.credentials.filter(
    (r) => r.url === hostname && r.fields.username,
  );

  ipcRenderer.send(`credentials-show-${store.windowId}`, {
    content: 'list',
    list,
  });
};

ipcRenderer.on('show-add-bookmark-dialog', () => {
  showAddBookmarkDialog();
});

ipcRenderer.on('show-zoom-dialog', () => {
  showZoomDialog();
});

ipcRenderer.on('zoom-factor-updated', (e, zoomFactor, showDialog) => {
  store.zoomFactor = zoomFactor;
  if (!store.dialogsVisibility['zoom'] && showDialog) {
    showZoomDialog();
  }
});

const onShieldContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
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

export const SiteButtons = observer(() => {
  const { selectedTab } = store.tabs;

  let hasCredentials = false;
  let blockedAds = 0;

  if (selectedTab) {
    hasCredentials = selectedTab.hasCredentials;
    blockedAds = selectedTab.blockedAds;
  }

  const dense = !store.isCompact;

  return (
    <>
      {process.env.ENABLE_AUTOFILL && hasCredentials && (
        <ToolbarButton
          dense={dense}
          icon={ICON_KEY}
          size={16}
          onClick={onKeyClick}
        />
      )}
      {(store.dialogsVisibility['zoom'] || store.zoomFactor !== 1) && (
        <ToolbarButton
          id="zoom"
          toggled={store.dialogsVisibility['zoom']}
          icon={store.zoomFactor >= 1 ? ICON_MAGNIFY_PLUS : ICON_MAGNIFY_MINUS}
          size={18}
          dense={dense}
          onMouseDown={onZoomClick}
        />
      )}
      <ToolbarButton
        id="star"
        toggled={store.dialogsVisibility['add-bookmark']}
        icon={store.isBookmarked ? ICON_STAR_FILLED : ICON_STAR}
        size={18}
        dense={dense}
        onMouseDown={onStarClick}
      />
      <ToolbarButton
        size={16}
        badge={store.settings.object.shield && blockedAds > 0}
        badgeText={blockedAds.toString()}
        icon={ICON_SHIELD}
        opacity={store.settings.object.shield ? 0.87 : 0.54}
        onContextMenu={onShieldContextMenu}
      ></ToolbarButton>
    </>
  );
});
