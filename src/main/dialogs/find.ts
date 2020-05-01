import { VIEW_Y_OFFSET } from '~/constants/design';
import { BrowserWindow } from 'electron';
import { Application } from '../application';

export const showFindDialog = (browserWindow: BrowserWindow) => {
  const { width } = browserWindow.getContentBounds();
  const appWindow = Application.instance.windows.fromBrowserWindow(
    browserWindow,
  );
  const selectedTab = appWindow.viewManager.selected;

  const dialog = Application.instance.dialogs.show({
    name: 'find',
    browserWindow,
    associateTab: true,
    bounds: {
      width: 416,
      height: 70,
      x: width - 416,
      y: VIEW_Y_OFFSET,
    },
    onVisibilityChange: (visible, tabId) => {
      const tab = appWindow.viewManager.views.get(tabId);
      return { tabId: tab.id, ...tab.findInfo };
    },
  });

  if (!dialog) return;

  dialog.handle('fetch', () => {
    return { tabId: selectedTab.id, ...selectedTab.findInfo };
  });

  dialog.on('set-find-info', (e, tabId, info) => {
    const tab = appWindow.viewManager.views.get(tabId);
    tab.findInfo = info;
  });
};
