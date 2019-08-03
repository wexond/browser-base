import { Menu, BrowserWindow } from 'electron';
import { defaultTabOptions } from '~/constants/tabs';
import { WindowsManager } from '../windows-manager';

export const getMainMenu = (windowsManager: WindowsManager) => {
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
            windowsManager.currentWindow.viewManager.selected.webContents.reload();
          },
        },
        {
          accelerator: 'CmdOrCtrl+F',
          label: 'Find in page',
          click() {
            windowsManager.currentWindow.webContents.send('find');
          },
        },
        {
          accelerator: 'CmdOrCtrl+T',
          label: 'New tab',
          click() {
            windowsManager.currentWindow.viewManager.create(defaultTabOptions);
          },
        },
        {
          accelerator: 'CmdOrCtrl+W',
          label: 'Close tab',
          click() {
            windowsManager.currentWindow.webContents.send(
              'remove-tab',
              windowsManager.currentWindow.viewManager.selectedId,
            );
          },
        },
        {
          accelerator: 'CmdOrCtrl+F4',
          label: 'Close tab',
          click() {
            windowsManager.currentWindow.webContents.send(
              'remove-tab',
              windowsManager.currentWindow.viewManager.selectedId,
            );
          },
        },
        {
          accelerator: 'CmdOrCtrl+Shift+T',
          label: 'Revert closed tab',
          click() {
            windowsManager.currentWindow.webContents.send('revert-closed-tab');
          },
        },
        {
          accelerator: 'CmdOrCtrl+Tab',
          label: 'Select next tab',
          click() {
            windowsManager.currentWindow.webContents.send('select-next-tab');
          },
        },
        {
          accelerator: 'Ctrl+Space',
          label: 'Toggle Overlay',
          click() {
            windowsManager.currentWindow.webContents.send('toggle-overlay');
          },
        },
        {
          accelerator: 'CmdOrCtrl+L',
          label: 'Toggle Overlay',
          click() {
            windowsManager.currentWindow.webContents.send('toggle-overlay');
          },
        },
        {
          accelerator: 'Alt+F',
          label: 'Toggle Overlay',
          click() {
            windowsManager.currentWindow.webContents.send('toggle-overlay');
          },
        },
        {
          accelerator: 'Alt+E',
          label: 'Toggle Overlay',
          click() {
            windowsManager.currentWindow.webContents.send('toggle-overlay');
          },
        },
        {
          accelerator: 'CmdOrCtrl+Left',
          label: 'Go back',
          click() {
            const { selected } = windowsManager.currentWindow.viewManager;
            if (selected) {
              selected.webContents.goBack();
            }
          },
        },
        {
          accelerator: 'CmdOrCtrl+Right',
          label: 'Go forward',
          click() {
            const { selected } = windowsManager.currentWindow.viewManager;
            if (selected) {
              selected.webContents.goForward();
            }
          },
        },
        {
          accelerator: 'Ctrl+Shift+W',
          label: 'Close current window',
          click() {
            windowsManager.currentWindow.close();
          },
        },
        {
          accelerator: 'Ctrl+N',
          label: 'New window',
          click() {
            windowsManager.createWindow();
          },
        },
        {
          accelerator: 'Ctrl+Shift+F12',
          label: 'Toggle developer tools (window)',
          click() {
            BrowserWindow.getFocusedWindow().webContents.openDevTools();
          },
        },
      ],
    },
  ]);
};
