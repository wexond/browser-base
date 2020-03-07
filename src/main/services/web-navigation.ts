import { WebContents, webContents } from 'electron';

import { webContentsToTab } from './extensions-messaging';

export const hookWebContentsEvents = (
  ses: Electron.Session,
  wc: WebContents,
) => {
  const sendEvent = (channel: string, ...args: any[]) => {
    webContents.getAllWebContents().forEach(wc => {
      // TODO(sentialx): type backgroundPage
      if (wc.getType() === 'remote') {
        wc.send(channel, ...args);
      }
    });
  };

  const tabId = wc.id;

  sendEvent('api-emit-event-tabs-onCreated');

  wc.on('will-navigate', (e, url) => {
    sendEvent('api-emit-event-webNavigation-onBeforeNavigate', {
      frameId: 0,
      parentFrameId: -1,
      processId: wc.getProcessId(),
      tabId,
      timeStamp: Date.now(),
      url,
    });
  });

  wc.on('did-start-loading', () => {
    const changeInfo = { status: 'loading' };

    sendEvent(
      'api-emit-event-tabs-onUpdated',
      tabId,
      changeInfo,
      webContentsToTab(wc),
    );
  });

  wc.on('did-stop-loading', () => {
    const changeInfo = { status: 'complete' };

    sendEvent(
      'api-emit-event-tabs-onUpdated',
      tabId,
      changeInfo,
      webContentsToTab(wc),
    );
  });

  wc.on('did-start-navigation', (e: any, url: string, isMainFrame: boolean) => {
    if (isMainFrame) {
      sendEvent('api-emit-event-webNavigation-onCommitted', {
        frameId: 0,
        parentFrameId: -1,
        processId: wc.getProcessId(),
        tabId,
        timeStamp: Date.now(),
        url,
      });
    }
  });

  wc.on('did-navigate', (e, url) => {
    sendEvent('api-emit-event-webNavigation-onCompleted', {
      frameId: 0,
      parentFrameId: -1,
      processId: wc.getProcessId(),
      tabId,
      timeStamp: Date.now(),
      url,
    });
  });

  wc.once('destroyed', () => {
    sendEvent('api-emit-event-tabs-onRemoved', tabId);
  });
};
