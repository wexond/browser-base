import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Bubble } from '../Bubble';
import {
  Line,
  MenuItem,
  MenuItems,
  Content,
  Icon,
  MenuItemTitle,
  Shortcut,
  RightControl,
} from './style';
import { icons } from '~/renderer/constants';
import store from '../../store';
import { ipcRenderer, remote } from 'electron';
import { WEBUI_BASE_URL, WEBUI_URL_SUFFIX } from '~/constants/files';
import { Switch } from '~/renderer/components/Switch';

const changeContent = () => () => {
  // store.overlay.currentContent = content;
};

const onFindClick = () => {
  /*store.overlay.visible = false;

  ipcRenderer.send(
    `find-show-${store.windowId}`,
    store.tabs.selectedTab.id,
    store.tabs.selectedTab.findInfo,
  );*/
};

const onDarkClick = () => {
  store.settings.darkContents = !store.settings.darkContents;
  store.save();
};

const onShieldClick = () => {
  store.settings.shield = !store.settings.shield;
  store.save();
};

const onAlwaysClick = () => {
  store.alwaysOnTop = !store.alwaysOnTop;
  remote.getCurrentWindow().setAlwaysOnTop(store.alwaysOnTop);
};

const onNewWindowClick = () => {
  ipcRenderer.send('create-window');
};

const onIncognitoClick = () => {
  ipcRenderer.send('create-window', true);
};

const goToWebUIPage = (name: string) => () => {
  ipcRenderer.send(`add-tab-${store.windowId}`, {
    url: `${WEBUI_BASE_URL}${name}${WEBUI_URL_SUFFIX}`,
    active: true,
  });
  store.hide();
};

export const QuickMenu = observer(() => {
  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column',
      }}
    >
      <Content>
        <MenuItems>
          <MenuItem onClick={onDarkClick}>
            <Icon icon={icons.night} />
            <MenuItemTitle>Night mode</MenuItemTitle>
            <RightControl>
              <Switch value={store.settings.darkContents}></Switch>
            </RightControl>
          </MenuItem>
          <MenuItem onClick={onAlwaysClick}>
            <Icon icon={icons.topMost} />
            <MenuItemTitle>Always on top</MenuItemTitle>
            <RightControl>
              <Switch value={store.alwaysOnTop}></Switch>
            </RightControl>
          </MenuItem>
          <Line />
          <MenuItem onClick={goToWebUIPage('newtab')}>
            <Icon icon={icons.tab} />
            <MenuItemTitle>New tab</MenuItemTitle>
            <Shortcut>Ctrl+T</Shortcut>
          </MenuItem>
          <MenuItem onClick={onNewWindowClick}>
            <Icon icon={icons.window} />
            <MenuItemTitle>New window</MenuItemTitle>
            <Shortcut>Ctrl+N</Shortcut>
          </MenuItem>
          <MenuItem onClick={onIncognitoClick}>
            <Icon icon={icons.incognito} />
            <MenuItemTitle>New incognito window</MenuItemTitle>
            <Shortcut>Ctrl+Shift+N</Shortcut>
          </MenuItem>
          <Line />
          <MenuItem onClick={goToWebUIPage('history')} arrow>
            <Icon icon={icons.history} />
            <MenuItemTitle>History</MenuItemTitle>
          </MenuItem>
          <MenuItem onClick={goToWebUIPage('bookmarks')} arrow>
            <Icon icon={icons.bookmarks} />
            <MenuItemTitle>Bookmarks</MenuItemTitle>
          </MenuItem>
          <MenuItem onClick={goToWebUIPage('downloads')}>
            <Icon icon={icons.download} />
            <MenuItemTitle>Downloads</MenuItemTitle>
          </MenuItem>
          <Line />
          <MenuItem onClick={goToWebUIPage('settings')}>
            <Icon icon={icons.settings} />
            <MenuItemTitle>Settings</MenuItemTitle>
          </MenuItem>
          <MenuItem onClick={goToWebUIPage('extensions')}>
            <Icon icon={icons.extensions} />
            <MenuItemTitle>Extensions</MenuItemTitle>
          </MenuItem>
          <Line />
          <MenuItem>
            <Icon icon={icons.find} />
            <MenuItemTitle>Find in page</MenuItemTitle>
            <Shortcut>Ctrl+F</Shortcut>
          </MenuItem>
          <MenuItem>
            <Icon icon={icons.print} />
            <MenuItemTitle>Print</MenuItemTitle>
            <Shortcut>Ctrl+P</Shortcut>
          </MenuItem>
        </MenuItems>
      </Content>
    </div>
  );
});
