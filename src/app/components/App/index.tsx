import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react';
import { Menu } from 'nersent-ui';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Handle, Line, NavIcons, StyledApp, TabsSection } from './styles';
import { Platforms } from '../../enums';
import Store from '../../store';
import { closeWindow, maximizeWindow, minimizeWindow } from '../../utils/window';
import AddressBar from '../AddressBar';
import Pages from '../Pages';
import TabBar from '../TabBar';
import ToolBar from '../ToolBar';
import ToolBarButton from '../ToolBarButton';
import ToolBarSeparator from '../ToolBarSeparator';
import WindowButton from '../WindowButton';

const backIcon = require('../../../shared/icons/actions/back.svg');
const forwardIcon = require('../../../shared/icons/actions/forward.svg');
const refreshIcon = require('../../../shared/icons/actions/refresh.svg');
const tabGroupsIcon = require('../../../shared/icons/actions/tab-groups.svg');
const menuIcon = require('../../../shared/icons/actions/menu.svg');

const closeIcon = require('../../../shared/icons/windows/close.svg');
const maximizeIcon = require('../../../shared/icons/windows/maximize.svg');
const minimizeIcon = require('../../../shared/icons/windows/minimize.svg');

interface State {
  isFullscreen: boolean;
}

@observer
class App extends React.Component<{}, State> {
  public state: State = {
    isFullscreen: false,
  };

  public onBackClick = () => {
    Store.getSelectedPage().webview.goBack();
  };

  public onForwardClick = () => {
    Store.getSelectedPage().webview.goForward();
  };

  public onRefreshClick = () => {
    Store.getSelectedPage().webview.reload();
  };

  public onInspectElementClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { x, y } = Store.contextMenuParams;
    Store.getSelectedPage().webview.inspectElement(x, y);
  };

  public async componentDidMount() {
    // ipcRenderer.send(ipcMessages.PLUGIN_INSTALL, 'wexond/wexond-example-plugin');

    ipcRenderer.on('fullscreen', (e: Electron.IpcMessageEvent, isFullscreen: boolean) => {
      this.setState({
        isFullscreen,
      });
    });

    window.addEventListener('mousemove', e => {
      Store.mouse.x = e.pageX;
      Store.mouse.y = e.pageY;
    });

    window.addEventListener('mousedown', e => {
      Store.pageMenu.toggle(false);
    });
  }

  public componentWillUnmount() {
    Store.pages = [];
  }

  public render() {
    const { isFullscreen } = this.state;

    const { theme } = Store.theme;

    return (
      <ThemeProvider theme={{ ...theme }}>
        <StyledApp>
          <ToolBar style={{ ...theme.toolbar.style }}>
            <Handle />
            <NavIcons isFullscreen={isFullscreen}>
              <ToolBarButton
                disabled={!Store.navigationState.canGoBack}
                size={24}
                icon={backIcon}
                style={{ marginLeft: 4 }}
                onClick={this.onBackClick}
              />
              <ToolBarButton
                disabled={!Store.navigationState.canGoForward}
                size={24}
                icon={forwardIcon}
                onClick={this.onForwardClick}
              />
              <ToolBarButton size={20} icon={refreshIcon} onClick={this.onRefreshClick} />
            </NavIcons>
            <ToolBarSeparator style={{ ...theme.toolbar.separators.style }} />
            <TabsSection style={{ ...theme.tabsSection.style }}>
              <AddressBar visible={Store.addressBar.toggled} />
              <TabBar />
            </TabsSection>
            <ToolBarSeparator style={{ ...theme.toolbar.separators.style }} />
            <ToolBarButton size={16} icon={tabGroupsIcon} />
            <ToolBarButton size={20} icon={menuIcon} style={{ marginRight: 4 }} />
            {Store.platform !== Platforms.MacOS && (
              <React.Fragment>
                <ToolBarSeparator />
                <WindowButton icon={minimizeIcon} onClick={minimizeWindow} />
                <WindowButton icon={maximizeIcon} onClick={maximizeWindow} />
                <WindowButton icon={closeIcon} onClick={closeWindow} />
              </React.Fragment>
            )}
            <Line style={{ ...theme.toolbar.bottomDivider.style }} />
          </ToolBar>
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
        </StyledApp>
      </ThemeProvider>
    );
  }
}

export default App;
