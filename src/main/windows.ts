import { platform } from 'os';
import { resolve, join } from 'path';
import { app, BrowserWindow } from 'electron';

export const createBrowserWindow = () => {
  const windowData: Electron.BrowserWindowConstructorOptions = {
    frame: process.env.ENV === 'dev' || platform() === 'darwin',
    minWidth: 400,
    minHeight: 450,
    width: 900,
    height: 700,
    show: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      plugins: true,
    },
    icon: resolve(app.getAppPath(), 'static/app-icons/icon.png'),
  };

  const window = new BrowserWindow(windowData);

  if (process.env.ENV === 'dev') {
    window.webContents.openDevTools({ mode: 'detach' });
    window.loadURL('http://localhost:4444/app.html');
  } else {
    window.loadURL(join('file://', app.getAppPath(), 'build/app.html'));
  }

  window.once('ready-to-show', () => {
    window.show();
  });

  return window;
};
