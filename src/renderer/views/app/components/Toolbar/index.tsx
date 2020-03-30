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
} from '~/renderer/constants/icons';
import { isDialogVisible } from '../../utils/dialogs';
import { isURL } from '~/utils';
import { callViewMethod } from '~/utils/view';
import { BLUE_500 } from '~/renderer/constants/colors';
import { VIEW_Y_OFFSET } from '~/constants/design';

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

let mouseUpped = false;

const onMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
  store.addressbarTextVisible = false;
  store.addressbarEditing = true;
};

const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  store.addressbarTextVisible = false;
  store.addressbarEditing = true;

  if (store.tabs.selectedTab) {
    store.tabs.selectedTab.addressbarFocused = true;
  }
};

const onMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
  if (
    e.currentTarget.selectionEnd - e.currentTarget.selectionStart === 0 &&
    !mouseUpped
  ) {
    e.currentTarget.select();
  }

  if (store.tabs.selectedTab) {
    store.tabs.selectedTab.addressbarSelectionRange = [
      e.currentTarget.selectionStart,
      e.currentTarget.selectionEnd,
    ];
  }

  mouseUpped = true;
};

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Escape' || e.key === 'Enter') {
    store.addressbarEditing = false;
    store.tabs.selectedTab.addressbarValue = null;
  }

  if (e.key === 'Escape') {
    const target = e.currentTarget;
    requestAnimationFrame(() => {
      target.select();
    });
  }

  if (e.key === 'Enter') {
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

const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  store.tabs.selectedTab.addressbarValue = e.currentTarget.value;
};

const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.blur();
  window.getSelection().removeAllRanges();
  store.addressbarTextVisible = true;
  store.addressbarEditing = false;
  mouseUpped = false;

  if (store.tabs.selectedTab) {
    store.tabs.selectedTab.addressbarFocused = false;
  }
};

export const Toolbar = observer(() => {
  return (
    <StyledToolbar>
      <NavigationButtons />
      <Addressbar focus={store.addressbarEditing}>
        <AddressbarInputContainer>
          <AddressbarInput
            ref={store.inputRef}
            spellCheck={false}
            onKeyDown={onKeyDown}
            onMouseDown={onMouseDown}
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
        </AddressbarInputContainer>

        <AddressbarText
          visible={store.addressbarTextVisible && store.addressbarValue !== ''}
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
      </Addressbar>
      <RightButtons />
    </StyledToolbar>
  );
});
