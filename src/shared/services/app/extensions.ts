import { ipcRenderer, remote } from 'electron';

import {
  API_TABS_QUERY,
  API_TABS_CREATE,
  API_TABS_INSERT_CSS,
  API_TABS_EXECUTE_SCRIPT,
  API_TABS_SET_ZOOM,
  API_TABS_GET_ZOOM,
  API_TABS_DETECT_LANGUAGE,
  API_PORT_POSTMESSAGE,
  API_RUNTIME_CONNECT,
  API_BROWSER_ACTION_SET_BADGE_TEXT,
} from '@/constants/extensions';
import { Tab } from '@/models/app';
import store from '@app/store';

export const runExtensionsService = () => {
  ipcRenderer.on(
    API_TABS_QUERY,
    (e: Electron.IpcMessageEvent, webContentsId: number) => {
      const sender = remote.webContents.fromId(webContentsId);

      let tabs: Tab[] = [];

      store.tabsStore.groups.forEach(element => {
        tabs = tabs.concat(element.tabs);
      });

      sender.send(API_TABS_QUERY, tabs.map(tab => tab.getApiTab()));
    },
  );

  ipcRenderer.on(
    API_TABS_CREATE,
    (
      e: Electron.IpcMessageEvent,
      data: chrome.tabs.CreateProperties,
      webContentsId: number,
    ) => {
      const sender = remote.webContents.fromId(webContentsId);

      const { url, active, index } = data;

      const tab = store.tabsStore.addTab({
        url,
        active,
        index,
      });

      sender.send(API_TABS_CREATE, tab.getApiTab());
    },
  );

  ipcRenderer.on(
    API_TABS_INSERT_CSS,
    (
      e: Electron.IpcMessageEvent,
      tabId: number,
      details: chrome.tabs.InjectDetails,
      sender: number,
    ) => {
      const webContents = remote.webContents.fromId(sender);
      const page = store.pagesStore.getById(tabId);

      if (page) {
        page.webview.insertCSS(details.code);
      }

      webContents.send(API_TABS_INSERT_CSS);
    },
  );

  ipcRenderer.on(
    API_TABS_EXECUTE_SCRIPT,
    (
      e: Electron.IpcMessageEvent,
      tabId: number,
      details: chrome.tabs.InjectDetails,
      sender: number,
    ) => {
      const webContents = remote.webContents.fromId(sender);
      const page = store.pagesStore.getById(tabId);

      if (page) {
        page.webview.executeJavaScript(details.code, false, (result: any) => {
          webContents.send(API_TABS_EXECUTE_SCRIPT, result);
        });
      }
    },
  );

  ipcRenderer.on(
    API_TABS_SET_ZOOM,
    (
      e: Electron.IpcMessageEvent,
      tabId: number,
      zoomFactor: number,
      sender: number,
    ) => {
      const webContents = remote.webContents.fromId(sender);
      const page = store.pagesStore.getById(tabId);

      page.webview.setZoomFactor(zoomFactor);
      webContents.send(API_TABS_SET_ZOOM);
    },
  );

  ipcRenderer.on(
    API_TABS_GET_ZOOM,
    (e: Electron.IpcMessageEvent, tabId: number, sender: number) => {
      const webContents = remote.webContents.fromId(sender);
      const page = store.pagesStore.getById(tabId);

      page.webview.getWebContents().getZoomFactor((zoomFactor: number) => {
        webContents.send(API_TABS_GET_ZOOM, zoomFactor);
      });
    },
  );

  ipcRenderer.on(
    API_TABS_DETECT_LANGUAGE,
    (e: Electron.IpcMessageEvent, tabId: number, sender: number) => {
      const webContents = remote.webContents.fromId(sender);
      const page = store.pagesStore.getById(tabId);

      page.webview.executeJavaScript(
        'document.documentElement.lang',
        true,
        (language: string) => {
          if (language !== '') {
            webContents.send(API_TABS_DETECT_LANGUAGE, language);
          } else {
            page.webview.executeJavaScript(
              'navigator.language',
              true,
              (lang: string) => {
                webContents.send(API_TABS_DETECT_LANGUAGE, lang);
              },
            );
          }
        },
      );
    },
  );

  ipcRenderer.on(
    API_PORT_POSTMESSAGE,
    (e: Electron.IpcMessageEvent, data: any) => {
      const { portId, msg, senderId } = data;

      for (const page of store.pagesStore.pages) {
        if (page.webview && page.webview.getWebContents().id !== senderId) {
          page.webview.send(API_PORT_POSTMESSAGE + portId, msg);
        }
      }
    },
  );

  ipcRenderer.on(
    API_RUNTIME_CONNECT,
    (e: Electron.IpcMessageEvent, data: any) => {
      const { bgPageId, sender, name, portId, webContentsId } = data;
      const contents = remote.webContents.fromId(bgPageId);

      sender.tab = store.tabsStore.getTabByWebContentsId(webContentsId);

      contents.send(API_RUNTIME_CONNECT, {
        portId,
        sender,
        name,
      });
    },
  );

  ipcRenderer.on(
    API_BROWSER_ACTION_SET_BADGE_TEXT,
    (
      e: Electron.IpcMessageEvent,
      senderId: number,
      extensionId: string,
      details: chrome.browserAction.BadgeTextDetails,
    ) => {
      if (details.tabId) {
        const browserAction = store.extensionsStore.queryBrowserAction({
          extensionId,
          tabId: details.tabId,
        })[0];
        if (browserAction) {
          browserAction.badgeText = details.text;
        }
      } else {
        store.extensionsStore
          .queryBrowserAction({
            extensionId,
          })
          .forEach(item => {
            item.badgeText = details.text;
          });
      }
      const contents = remote.webContents.fromId(senderId);
      contents.send(API_BROWSER_ACTION_SET_BADGE_TEXT);
    },
  );
};
