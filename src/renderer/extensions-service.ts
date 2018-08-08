import { remote, ipcRenderer } from 'electron';

import store from './store';
import {
  API_TABS_QUERY,
  API_TABS_CREATE,
  API_TABS_INSERT_CSS,
  API_TABS_EXECUTE_SCRIPT,
  API_TABS_SET_ZOOM,
  API_TABS_GET_ZOOM,
  API_TABS_DETECT_LANGUAGE,
} from '../constants';

export const runExtensionsService = () => {
  ipcRenderer.on(API_TABS_QUERY, (e: Electron.IpcMessageEvent, webContentsId: number) => {
    const sender = remote.webContents.fromId(webContentsId);

    let tabs: chrome.tabs.Tab[] = [];

    for (const workspace of store.workspaces) {
      tabs = tabs.concat(workspace.tabs.map(tab => tab.getIpcTab()));
    }

    sender.send(API_TABS_QUERY, tabs);
  });

  ipcRenderer.on(
    API_TABS_CREATE,
    (e: Electron.IpcMessageEvent, data: chrome.tabs.CreateProperties, webContentsId: number) => {
      const sender = remote.webContents.fromId(webContentsId);

      const { url, active, index } = data;

      const tab = store.getCurrentWorkspace().addTab({
        url,
        active,
        index,
      });

      sender.send(API_TABS_CREATE, tab.getIpcTab());
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
      const page = store.getPageById(tabId);

      page.webview.insertCSS(details.code);
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
      const page = store.getPageById(tabId);

      page.webview.executeJavaScript(details.code, false, (result: any) => {
        webContents.send(API_TABS_EXECUTE_SCRIPT, result);
      });
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
      const page = store.getPageById(tabId);

      page.webview.setZoomFactor(zoomFactor);
      webContents.send(API_TABS_SET_ZOOM);
    },
  );

  ipcRenderer.on(
    API_TABS_GET_ZOOM,
    (
      e: Electron.IpcMessageEvent,
      tabId: number,
      sender: number,
    ) => {
      const webContents = remote.webContents.fromId(sender);
      const page = store.getPageById(tabId);

      page.webview.getWebContents().getZoomFactor((zoomFactor: number) => {
        webContents.send(API_TABS_GET_ZOOM, zoomFactor);
      });
    },
  );

  ipcRenderer.on(
    API_TABS_DETECT_LANGUAGE,
    (
      e: Electron.IpcMessageEvent,
      tabId: number,
      sender: number,
    ) => {
      const webContents = remote.webContents.fromId(sender);
      const page = store.getPageById(tabId);

      page.webview.executeJavaScript('document.documentElement.lang', true, (language: string) => {
        if (language !== "") webContents.send(API_TABS_DETECT_LANGUAGE, language);
        else page.webview.executeJavaScript('navigator.language', true, (language: string) => {
          webContents.send(API_TABS_DETECT_LANGUAGE, language);
        });
      });
    },
  );
};
