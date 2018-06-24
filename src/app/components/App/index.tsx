import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { StyledApp } from './styles';
import Store from '../../store';
import Pages from '../Pages';
import Toolbar from '../Toolbar';
import Menu from '../Menu';
import ContextMenu from '../../../shared/components/ContextMenu';

@observer
export default class App extends React.Component {
  public onInspectElementClick = () => {
    const { x, y } = Store.webviewContextMenuParams;
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
          <ContextMenu
            large
            dense
            ref={(r: ContextMenu) => (Store.pageMenu = r)}
            onMouseDown={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: Store.pageMenuData.x,
              top: Store.pageMenuData.y,
              zIndex: 999,
            }}
          >
            <ContextMenu.Item onClick={this.onInspectElementClick}>
              Inspect element
            </ContextMenu.Item>
          </ContextMenu>
          <Menu title="Wexond" />
        </StyledApp>
      </ThemeProvider>
    );
  }
}
