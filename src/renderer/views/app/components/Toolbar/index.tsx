import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import { parse } from 'url';

import store from '../../store';
import { Buttons, StyledToolbar, Handle, Separator } from './style';
import { NavigationButtons } from './NavigationButtons';
import { Tabbar } from './Tabbar';
import { ToolbarButton } from './ToolbarButton';
import { icons, colors } from '~/renderer/constants';
import { BrowserAction } from './BrowserAction';

const onUpdateClick = () => {
  ipcRenderer.send('update-install');
};

const onKeyClick = async () => {
  const { hostname } = parse(store.tabs.selectedTab.url);

  const list = (await store.formFill.db.get({
    type: 'password',
    url: hostname,
  })).filter(r => r.fields.username);

  ipcRenderer.send('credentials-show', {
    content: 'list',
    list,
  });
};

const BrowserActions = observer(() => {
  const { selectedTabId } = store.tabGroups.currentGroup;

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

export const Toolbar = observer(() => {
  const { selectedTab } = store.tabs;

  let isWindow = false;
  let blockedAds = 0;
  let hasCredentials = false;

  if (selectedTab) {
    isWindow = selectedTab.isWindow;
    blockedAds = selectedTab.blockedAds;
    hasCredentials = selectedTab.hasCredentials;
  }

  return (
    <StyledToolbar
      overlayType={store.overlay.currentContent}
      isHTMLFullscreen={store.isHTMLFullscreen}
    >
      <Handle />
      <div style={{ flex: 1, display: 'flex' }}>
        <div
          style={{ flex: 1, display: store.tabbarVisible ? 'flex' : 'none' }}
        >
          <NavigationButtons />
          <Tabbar />
        </div>
      </div>
      <Buttons>
        <BrowserActions />
        {store.updateInfo.available && (
          <ToolbarButton icon={icons.download} onClick={onUpdateClick} />
        )}
        {store.extensions.browserActions.length > 0 && <Separator />}
        {hasCredentials && (
          <ToolbarButton icon={icons.key} size={16} onClick={onKeyClick} />
        )}
        {!isWindow && (
          <BrowserAction
            size={18}
            style={{ marginLeft: 0 }}
            opacity={0.54}
            autoInvert
            data={{
              badgeBackgroundColor: colors.blue['500'],
              badgeText: blockedAds > 0 ? blockedAds.toString() : '',
              icon: icons.shield,
              badgeTextColor: 'white',
            }}
          />
        )}
        {store.isIncognito && (
          <>
            <Separator />
            <ToolbarButton icon={icons.incognito} size={18} />
          </>
        )}
      </Buttons>
    </StyledToolbar>
  );
});
