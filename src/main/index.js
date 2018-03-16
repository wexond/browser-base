const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  createWindow();
});

const createWindow = () => {
  mainWindow = new BrowserWindow(
    {
      frame: false,
      minWidth: 300,
      minHeight: 430,
      width: 900,
      height: 700,
      show: false,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        preload: path.resolve(__dirname, 'preloads/index.js')
      }
    }
  );

  if (process.env.NODE_ENV === 'dev') {
    mainWindow.webContents.openDevTools({mode: 'detach'}); 
  }

  mainWindow.loadURL(path.join('file://', __dirname, '../../static/pages/app.html'));

  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on("enter-full-screen", () => {
    mainWindow.webContents.send("fullscreen", true);
  });

  mainWindow.on("leave-full-screen", () => {
    mainWindow.webContents.send("fullscreen", false);
  });
};
