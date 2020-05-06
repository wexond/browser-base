import { sendToExtensionPages } from '../background-pages';

export const hookWebNavigationEvents = (tab: Electron.WebContents) => {
  tab.on(
    'did-start-navigation',
    (e, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) => {
      sendToExtensionPages('webNavigation.onCommitted', {
        frameId: isMainFrame ? 0 : frameRoutingId,
        parentFrameId: -1,
        processId: frameProcessId,
        tabId: tab.id,
        timeStamp: Date.now(),
        url,
      });
    },
  );

  tab.on('will-navigate', (e, url) => {
    sendToExtensionPages('webNavigation.onBeforeNavigate', {
      frameId: 0,
      parentFrameId: -1,
      processId: -1,
      tabId: tab.id,
      timeStamp: Date.now(),
      url,
    });
  });

  tab.on('did-navigate', (e, url) => {
    sendToExtensionPages('webNavigation.onCompleted', {
      frameId: 0,
      parentFrameId: -1,
      processId: tab.getProcessId(),
      tabId: tab.id,
      timeStamp: Date.now(),
      url,
    });
  });

  tab.on(
    'did-navigate-in-page',
    (e, url, isMainFrame, frameProcessId, frameRoutingId) => {
      sendToExtensionPages('webNavigation.onCompleted', {
        frameId: isMainFrame ? 0 : frameRoutingId,
        parentFrameId: -1,
        processId: frameProcessId,
        tabId: tab.id,
        timeStamp: Date.now(),
        url,
      });
    },
  );

  tab.once('will-navigate', (e, url) => {
    sendToExtensionPages('webNavigation.onCreatedNavigationTarget', {
      sourceTabId: tab.id,
      sourceProcessId: tab.getProcessId(),
      sourceFrameId: 0,
      url,
      tabId: tab.id,
      timeStamp: Date.now(),
    });
  });
};
