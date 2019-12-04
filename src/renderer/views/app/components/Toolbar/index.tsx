import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import { parse } from 'url';

import store from '../../store';
import { Buttons, StyledToolbar, Separator } from './style';
import { NavigationButtons } from './NavigationButtons';
import { Tabbar } from './Tabbar';
import { ToolbarButton } from './ToolbarButton';
import { icons } from '~/renderer/constants';
import { BrowserAction } from './BrowserAction';
import { platform } from 'os';
import { TOOLBAR_HEIGHT } from '~/constants/design';
import { WindowsControls } from 'react-windows-controls';

const onDownloadsClick = (e: React.MouseEvent<HTMLDivElement>) => {
  store.downloadNotification = false;
  const { left, width } = e.currentTarget.getBoundingClientRect();
  ipcRenderer.send(`show-downloads-dialog-${store.windowId}`, left + width / 2);
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

const onMenuClick = () => {
  ipcRenderer.send(`menu-show-${store.windowId}`);
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

const onCloseClick = () => ipcRenderer.send(`window-close-${store.windowId}`);

const onMouseEnter = () => {
  ipcRenderer.send(`window-fix-dragging-${store.windowId}`);
};

const onMaximizeClick = () =>
  ipcRenderer.send(`window-toggle-maximize-${store.windowId}`);

const onMinimizeClick = () =>
  ipcRenderer.send(`window-minimize-${store.windowId}`);

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
      {hasCredentials && (
        <ToolbarButton icon={icons.key} size={16} onClick={onKeyClick} />
      )}
      {store.settings.object.shield == true && (
        <ToolbarButton
          size={18}
          badge={blockedAds > 0}
          badgeText={blockedAds.toString()}
          icon={icons.shield}
        ></ToolbarButton>
      )}

      {store.downloadsButtonVisible && (
        <ToolbarButton
          size={18}
          badge={store.downloadNotification}
          onMouseDown={onDownloadsClick}
          icon={icons.download}
          badgeTop={9}
          badgeRight={9}
          preloader
          value={store.downloadProgress}
        ></ToolbarButton>
      )}
      <Separator />
      {store.isIncognito && <ToolbarButton icon={icons.incognito} size={18} />}
      <ToolbarButton onMouseDown={onMenuClick} icon={icons.menu} size={18} />
    </Buttons>
  );
});

export const Toolbar = observer(() => {
  return (
    <StyledToolbar
      onMouseEnter={onMouseEnter}
      isHTMLFullscreen={store.isHTMLFullscreen}
    >
      <NavigationButtons />
      <Tabbar />
      <RightButtons />
      {platform() !== 'darwin' && (
        <WindowsControls
          style={{
            height: TOOLBAR_HEIGHT,
            WebkitAppRegion: 'no-drag',
            marginLeft: 8,
          }}
          onClose={onCloseClick}
          onMinimize={onMinimizeClick}
          onMaximize={onMaximizeClick}
          dark={store.theme['toolbar.lightForeground']}
        />
      )}
    </StyledToolbar>
  );
});
