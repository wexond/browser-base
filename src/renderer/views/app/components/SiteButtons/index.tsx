import * as React from 'react';
import { observer } from 'mobx-react-lite';

import {
  ICON_STAR,
  ICON_STAR_FILLED,
  ICON_KEY,
  ICON_MAGNIFY_PLUS,
  ICON_MAGNIFY_MINUS,
} from '~/renderer/constants/icons';
import { ipcRenderer } from 'electron';
import { parse } from 'url';
import store from '../../store';
import { ToolbarButton } from '../ToolbarButton';

let starRef: HTMLDivElement = null;
let zoomRef: HTMLDivElement = null;

const showAddBookmarkDialog = async () => {
  const { right, bottom } = starRef.getBoundingClientRect();
  ipcRenderer.send(`show-add-bookmark-dialog-${store.windowId}`, right, bottom);
};

const showZoomDialog = async () => {
  if (store.zoomFactor != 1) {
    const { right, bottom } = zoomRef.getBoundingClientRect();
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

export const SiteButtons = observer(() => {
  const { selectedTab } = store.tabs;

  let hasCredentials = false;

  if (selectedTab) {
    hasCredentials = selectedTab.hasCredentials;
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
          divRef={(r) => (zoomRef = r)}
          toggled={store.dialogsVisibility['zoom']}
          icon={store.zoomFactor >= 1 ? ICON_MAGNIFY_PLUS : ICON_MAGNIFY_MINUS}
          size={18}
          dense={dense}
          onMouseDown={onZoomClick}
        />
      )}
      <ToolbarButton
        divRef={(r) => (starRef = r)}
        toggled={store.dialogsVisibility['add-bookmark']}
        icon={store.isBookmarked ? ICON_STAR_FILLED : ICON_STAR}
        size={18}
        dense={dense}
        onMouseDown={onStarClick}
      />
    </>
  );
});
