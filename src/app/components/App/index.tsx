import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react';
import { Menu } from 'nersent-ui';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { StyledApp } from './styles';
import Store from '../../store';
import Pages from '../Pages';
import Toolbar from '../Toolbar';
import NavigationDrawer from '../NavigationDrawer';

@observer
export default class App extends React.Component {
  public onInspectElementClick = () => {
    const { x, y } = Store.contextMenuParams;
    Store.getSelectedPage().webview.inspectElement(x, y);
  };

  public async componentDidMount() {
    ipcRenderer.on('fullscreen', (e: Electron.IpcMessageEvent, isFullscreen: boolean) => {
      Store.isFullscreen = isFullscreen;
    });

    window.addEventListener('mousemove', e => {
      Store.mouse.x = e.pageX;
      Store.mouse.y = e.pageY;
    });

    window.addEventListener('mousedown', () => {
      Store.pageMenu.toggle(false);
    });

    // ipcRenderer.send(ipcMessages.PLUGIN_INSTALL, 'wexond/wexond-example-plugin');
  }

  public componentWillUnmount() {
    Store.pages = [];
  }

  public render() {
    const { theme } = Store.theme;

    return (
      <ThemeProvider theme={{ ...theme }}>
        <StyledApp>
          <Toolbar />
          <Pages />
          <Menu
            large
            dense
            ref={(r: Menu) => (Store.pageMenu = r)}
            onMouseDown={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: Store.pageMenuData.x,
              top: Store.pageMenuData.y,
              zIndex: 999,
            }}
          >
            <Menu.Item onClick={this.onInspectElementClick}>Inspect element</Menu.Item>
          </Menu>
          <NavigationDrawer title="Wexond" />
        </StyledApp>
      </ThemeProvider>
    );
  }
}
