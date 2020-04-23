import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ipcRenderer, remote } from 'electron';
import { parse } from 'url';

import store from '../../store';
import {
  Buttons,
  StyledToolbar,
  Separator,
  Addressbar,
  AddressbarText,
  AddressbarInput,
  AddressbarInputContainer,
} from './style';
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
  ICON_SEARCH,
  ICON_DASHBOARD,
  ICON_MAGNIFY_PLUS,
  ICON_MAGNIFY_MINUS,
} from '~/renderer/constants/icons';
import { isDialogVisible } from '../../utils/dialogs';
import { isURL } from '~/utils';
import { callViewMethod } from '~/utils/view';

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
    (r) => r.url === hostname && r.fields.username,
  );

  ipcRenderer.send(`credentials-show-${store.windowId}`, {
    content: 'list',
    list,
  });
};

let starRef: HTMLDivElement = null;
let menuRef: HTMLDivElement = null;
let zoomRef: HTMLDivElement = null;

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

const showZoomDialog = async () => {
  if (!(await isDialogVisible('zoomDialog')) && store.zoomFactor != 1) {
    const { right, bottom } = zoomRef.getBoundingClientRect();
    ipcRenderer.send(
      `show-zoom-dialog-${store.windowId}`,
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

ipcRenderer.on('show-zoom-dialog', () => {
  showZoomDialog();
});

ipcRenderer.on('show-menu-dialog', () => {
  showMenuDialog();
});

ipcRenderer.on('zoom-factor-updated', (e, zoomFactor) => {
  store.zoomFactor = zoomFactor;
  if(!store.dialogsVisibility['zoom']) {
    showZoomDialog();
  }
});

const onStarClick = (e: React.MouseEvent<HTMLDivElement>) => {
  showAddBookmarkDialog();
};

const onZoomClick = (e: React.MouseEvent<HTMLDivElement>) => {
  showZoomDialog();
};

const onMenuClick = async () => {
  showMenuDialog();
};

const BrowserActions = observer(() => {
  const { selectedTabId } = store.tabs;

  return (
    <>
      {selectedTabId &&
        store.extensions.browserActions.map((item) => {
          if (item.tabId === selectedTabId) {
            return <BrowserAction data={item} key={item.extensionId} />;
          }
          return null;
        })}
    </>
  );
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

const RightButtons = observer(() => {
  const { selectedTab } = store.tabs;

  let blockedAds = 0;

  if (selectedTab) {
    blockedAds = selectedTab.blockedAds;
  }

  return (
    <Buttons>
      <BrowserActions />
      {store.extensions.browserActions.length > 0 && <Separator />}

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
      {store.isIncognito && <ToolbarButton icon={ICON_INCOGNITO} size={18} />}
      <ToolbarButton
        divRef={(r) => (menuRef = r)}
        toggled={store.dialogsVisibility['menu']}
        badge={store.updateAvailable}
        badgeRight={10}
        badgeTop={6}
        onMouseDown={onMenuClick}
        icon={ICON_MORE}
        size={18}
      />
    </Buttons>
  );
});

let mouseUpped = false;

const onMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
  store.addressbarTextVisible = false;
  store.addressbarFocused = true;
};

const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  store.addressbarTextVisible = false;
  store.addressbarFocused = true;

  if (store.tabs.selectedTab) {
    store.tabs.selectedTab.addressbarFocused = true;
  }
};

const onSelect = (e: React.MouseEvent<HTMLInputElement>) => {
  if (store.tabs.selectedTab) {
    store.tabs.selectedTab.addressbarSelectionRange = [
      e.currentTarget.selectionStart,
      e.currentTarget.selectionEnd,
    ];
  }
};

const onMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
  if (window.getSelection().toString().length === 0 && !mouseUpped) {
    e.currentTarget.select();
  }

  mouseUpped = true;
};

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Escape' || e.key === 'Enter') {
    store.tabs.selectedTab.addressbarValue = null;
  }

  if (e.key === 'Escape') {
    const target = e.currentTarget;
    requestAnimationFrame(() => {
      target.select();
    });
  }

  if (e.key === 'Enter') {
    store.addressbarFocused = false;
    e.currentTarget.blur();
    const { value } = e.currentTarget;
    let url = value;

    if (isURL(value)) {
      url = value.indexOf('://') === -1 ? `http://${value}` : value;
    } else {
      url = store.settings.searchEngine.url.replace('%s', value);
    }

    store.tabs.selectedTab.addressbarValue = url;
    callViewMethod(store.tabs.selectedTabId, 'loadURL', url);
  }
};

const addressbarRef = React.createRef<HTMLDivElement>();

const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  store.tabs.selectedTab.addressbarValue = e.currentTarget.value;

  const { left, width } = addressbarRef.current.getBoundingClientRect();

  if (e.currentTarget.value.trim() !== '') {
    ipcRenderer.send(`search-show-${store.windowId}`, {
      text: e.currentTarget.value,
      cursorPos: e.currentTarget.selectionStart,
      x: left,
      width: width,
    });
    store.addressbarEditing = true;
  }
};

const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.blur();
  window.getSelection().removeAllRanges();
  store.addressbarTextVisible = true;
  store.addressbarFocused = false;
  mouseUpped = false;

  if (store.tabs.selectedTab) {
    store.tabs.selectedTab.addressbarFocused = false;
  }
};

export const Toolbar = observer(() => {
  const { selectedTab } = store.tabs;

  let hasCredentials = false;

  if (selectedTab) {
    hasCredentials = selectedTab.hasCredentials;
  }

  return (
    <StyledToolbar>
      <NavigationButtons />
      <Addressbar ref={addressbarRef} focus={store.addressbarFocused}>
        <ToolbarButton
          toggled={false}
          icon={ICON_SEARCH}
          size={16}
          dense
          iconStyle={{ transform: 'scale(-1,1)' }}
        />
        <AddressbarInputContainer>
          <AddressbarInput
            ref={store.inputRef}
            spellCheck={false}
            onKeyDown={onKeyDown}
            onMouseDown={onMouseDown}
            onSelect={onSelect}
            onBlur={onBlur}
            onFocus={onFocus}
            onMouseUp={onMouseUp}
            onChange={onChange}
            placeholder="Search or type in a URL"
            visible={
              !store.addressbarTextVisible || store.addressbarValue === ''
            }
            value={store.addressbarValue}
          ></AddressbarInput>
          <AddressbarText
            visible={
              store.addressbarTextVisible && store.addressbarValue !== ''
            }
          >
            {store.addressbarUrlSegments.map((item, key) => (
              <div
                key={key}
                style={{
                  opacity: item.grayOut ? 0.54 : 1,
                }}
              >
                {item.value}
              </div>
            ))}
          </AddressbarText>
        </AddressbarInputContainer>

        {hasCredentials && (
          <ToolbarButton icon={ICON_KEY} size={16} onClick={onKeyClick} />
        )}
        {store.zoomFactor != 1 && (
          <ToolbarButton
            divRef={(r) => (zoomRef = r)}
            toggled={store.dialogsVisibility['zoom']}
            icon={store.zoomFactor > 1 ? ICON_MAGNIFY_PLUS : ICON_MAGNIFY_MINUS}
            size={18}
            dense
            onMouseDown={onZoomClick}
          />
        )}
        <ToolbarButton
          divRef={(r) => (starRef = r)}
          toggled={store.dialogsVisibility['add-bookmark']}
          icon={store.isBookmarked ? ICON_STAR_FILLED : ICON_STAR}
          size={18}
          dense
          onMouseDown={onStarClick}
        />
      </Addressbar>
      <RightButtons />
    </StyledToolbar>
  );
});
