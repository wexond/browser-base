import { BrowserWindow, app } from 'electron';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { platform } from 'os';

import { getPath } from '@/utils/paths';
import { WindowState } from '@/interfaces/main';
import { filesContent } from '@/constants/paths';
import { FULLSCREEN } from '@/constants/ipc-messages';

export const createWindow = () => {
  const windowDataPath = getPath('window-data.json');

  let windowState: WindowState = {};

  if (existsSync(windowDataPath)) {
    try {
      // Read the last window state from file.
      windowState = JSON.parse(readFileSync(windowDataPath, 'utf8'));
    } catch (e) {
      writeFileSync(windowDataPath, filesContent.windowData);
    }
  }

  let windowData: Electron.BrowserWindowConstructorOptions = {
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

  // Merge bounds from the last window state to the current window options.
  if (windowState) {
    windowData = {
      ...windowData,
      ...windowState.bounds,
    };
  }

  const window = new BrowserWindow(windowData);

  // Maximize if the last window was maximized.
  if (windowState && windowState.maximized) {
    window.maximize();
  }

  // Update window bounds on resize and on move when window is not maximized.
  window.on('resize', () => {
    if (!window.isMaximized()) {
      windowState.bounds = window.getBounds();
    }
  });
  window.on('move', () => {
    if (!window.isMaximized()) {
      windowState.bounds = window.getBounds();
    }
  });

  // Save current window state to file.
  window.on('close', () => {
    windowState.maximized = window.isMaximized();
    writeFileSync(windowDataPath, JSON.stringify(windowState));
  });

  window.webContents.openDevTools({ mode: 'detach' });
  if (process.env.ENV === 'dev') {
    window.webContents.openDevTools({ mode: 'detach' });
    window.loadURL('http://localhost:4444/app.html');
  } else {
    window.loadURL(join('file://', app.getAppPath(), 'build/app.html'));
  }

  window.once('ready-to-show', () => {
    window.show();
  });

  window.on('enter-full-screen', () => {
    window.webContents.send(FULLSCREEN, true);
  });

  window.on('leave-full-screen', () => {
    window.webContents.send(FULLSCREEN, false);
  });

  window.webContents.addListener('will-navigate', e => e.preventDefault());

  return window;
};
