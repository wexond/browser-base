import './scss/index.scss';
import { Tabs } from './tabs';
import { platform } from 'os';
import { closeWindow, maximizeWindow, minimizeWindow } from './utils';
import { Tab } from './models';

export class App {
  public tabs = new Tabs();

  public windowsButtons = document.getElementById('windows-buttons');
  public windowsCloseButton = document.getElementById('window-close');
  public windowsMaximizeButton = document.getElementById('window-maximize');
  public windowsMinimizeButton = document.getElementById('window-minimize');
  public toolbar = document.getElementById('toolbar');

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

    requestAnimationFrame(() => {
      this.tabs.addTab();
    });

    if (platform() === 'darwin') {
      this.toolbar.style.paddingLeft = '72px';
    }
  }

  public mouse = {
    x: 0,
    y: 0,
  };
}

export default new App();
