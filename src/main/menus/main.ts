import { AppWindow } from '../windows';
import { Menu } from 'electron';
import { defaultTabOptions } from '~/constants/tabs';

export const getMainMenu = (appWindow: AppWindow) => {
  return Menu.buildFromTemplate([
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        { role: 'quit', accelerator: 'CmdOrCtrl+Shift+Q' },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            appWindow.viewManager.selected.webContents.reload();
          },
        },
        {
          accelerator: 'CmdOrCtrl+F',
          label: 'Find in page',
          click() {
            appWindow.webContents.send('find');
          },
        },
        {
          accelerator: 'CmdOrCtrl+T',
          label: 'New tab',
          click() {
            appWindow.viewManager.create(defaultTabOptions);
          },
        },
        {
          accelerator: 'CmdOrCtrl+W',
          label: 'Close tab',
          click() {
            appWindow.webContents.send(
              'remove-tab',
              appWindow.viewManager.selectedId,
            );
          },
        },
        {
          accelerator: 'CmdOrCtrl+F4',
          label: 'Close tab',
          click() {
            appWindow.webContents.send(
              'remove-tab',
              appWindow.viewManager.selectedId,
            );
          },
        },
        {
          accelerator: 'CmdOrCtrl+Shift+T',
          label: 'Revert closed tab',
          click() {
            appWindow.webContents.send('revert-closed-tab');
          },
        },
        {
          accelerator: 'CmdOrCtrl+Tab',
          label: 'Select next tab',
          click() {
            appWindow.webContents.send('select-next-tab');
          },
        },
        {
          accelerator: 'Ctrl+Space',
          label: 'Toggle Overlay',
          click() {
            appWindow.webContents.send('toggle-overlay');
          },
        },
        {
          accelerator: 'CmdOrCtrl+L',
          label: 'Toggle Overlay',
          click() {
            appWindow.webContents.send('toggle-overlay');
          },
        },
        {
          accelerator: 'CmdOrCtrl+Left',
          label: 'Go back',
          click() {
            const { selected } = appWindow.viewManager;
            if (selected) {
              selected.webContents.goBack();
            }
          },
        },
        {
          accelerator: 'CmdOrCtrl+Right',
          label: 'Go forward',
          click() {
            const { selected } = appWindow.viewManager;
            if (selected) {
              selected.webContents.goForward();
            }
          },
        },
        {
          accelerator: 'Ctrl+Shift+W',
          label: 'Close current window',
          click() {
            appWindow.close();
          },
        },
      ],
    },
  ]);
};
