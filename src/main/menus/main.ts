import { AppWindow } from '../app-window';

export const getMainMenu = (appWindow: AppWindow) => [
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
      { role: 'quit' },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          if (process.env.ENV === 'dev') {
            appWindow.webContents.reload();
          } else {
            appWindow.viewManager.selected.webContents.reload();
          }
        },
      },
      {
        accelerator: 'CmdOrCtrl+F',
        label: 'Find in page',
        click() {
          appWindow.webContents.send('find');
        },
      },
    ],
  },
];
