import './scss/index.scss';
import { Tabs } from './tabs';
import { platform } from 'os';
import { closeWindow, maximizeWindow, minimizeWindow } from './utils';
import { TabGroups } from './tab-groups';
import { ipcRenderer } from 'electron';

export class App {
  public tabs = new Tabs();
  public tabGroups = new TabGroups();

  public windowsButtons = document.getElementById('windows-buttons');
  public windowsCloseButton = document.getElementById('window-close');
  public windowsMaximizeButton = document.getElementById('window-maximize');
  public windowsMinimizeButton = document.getElementById('window-minimize');

  public toolbar = document.getElementById('toolbar');

  public back = document.getElementById('back');
  public forward = document.getElementById('forward');
  public refresh = document.getElementById('refresh');

  public toolbarSeparator = document.getElementById('separator-1');

  constructor() {
    if (platform() === 'darwin') {
      this.windowsButtons.style.display = 'none';
    }

    this.windowsCloseButton.onclick = () => {
      closeWindow();
    };

    this.windowsMaximizeButton.onclick = () => {
      maximizeWindow();
    };

    this.windowsMinimizeButton.onclick = () => {
      minimizeWindow();
    };

    ipcRenderer.on(
      'update-navigation-state',
      (e: Electron.IpcMessageEvent, data: any) => {
        if (data.canGoBack) {
          this.back.classList.remove('disabled');
        } else {
          this.back.classList.add('disabled');
        }

        if (data.canGoForward) {
          this.forward.classList.remove('disabled');
        } else {
          this.forward.classList.add('disabled');
        }
      },
    );

    requestAnimationFrame(() => {
      this.tabs.addTab();
    });

    if (platform() === 'darwin') {
      this.toolbar.style.paddingLeft = '72px';
    }

    window.addEventListener('mousemove', e => {
      this.mouse.x = e.pageX;
      this.mouse.y = e.pageY;
    });
  }

  public mouse = {
    x: 0,
    y: 0,
  };
}

export default new App();
