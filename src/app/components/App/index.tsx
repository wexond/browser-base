import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react'; // eslint-disable-line no-unused-vars
import React from 'react';
import { ThemeProvider } from 'styled-components';

// Enums
import { Platforms } from '../../../shared/enums';
import { Icons } from '../../enums';

// Utils
import { closeWindow, maximizeWindow, minimizeWindow } from '../../utils/window';

// Components
import AddressBar from '../AddressBar';
import Pages from '../Pages';
import TabBar from '../TabBar';
import ToolBar from '../ToolBar';
import ToolBarButton from '../ToolBarButton';
import ToolBarSeparator from '../ToolBarSeparator';
import WindowButton from '../WindowButton';

// Styles
import { Handle, Line, NavIcons, StyledApp, TabsSection } from './styles';

import Store from '../../store';

interface State {
  isFullscreen: boolean;
}

@observer
export default class App extends React.Component<{}, State> {
  public state: State = {
    isFullscreen: false,
  };

  public async componentDidMount() {
    ipcRenderer.on('fullscreen', (e: any, isFullscreen: boolean) => {
      this.setState({
        isFullscreen,
      });
    });

    window.addEventListener('mousemove', (e) => {
      Store.mouse.x = e.pageX;
      Store.mouse.y = e.pageY;
    });
  }

  public render() {
    const { isFullscreen } = this.state;

    const { tabbar } = Store.theme;

    return (
      <ThemeProvider theme={{ ...Store.theme }}>
        <StyledApp>
          <ToolBar>
            <Handle />
            <NavIcons isFullscreen={isFullscreen}>
              <ToolBarButton size={24} icon={Icons.Back} style={{ marginLeft: 4 }} />
              <ToolBarButton size={24} icon={Icons.Forward} />
              <ToolBarButton size={20} icon={Icons.Refresh} />
            </NavIcons>
            <ToolBarSeparator />
            <TabsSection
              style={{
                marginLeft: tabbar.marginLeft,
                marginRight: tabbar.marginRight,
                marginTop: tabbar.marginTop,
                marginBottom: tabbar.marginBottom,
                margin: tabbar.margin,
              }}
            >
              <AddressBar visible={Store.addressBar.toggled} />
              <TabBar />
            </TabsSection>
            <ToolBarSeparator />
            <ToolBarButton size={16} icon={Icons.TabGroups} />
            <ToolBarButton size={18} icon={Icons.More} style={{ marginRight: 4 }} />
            {Store.platform !== Platforms.MacOS && (
              <React.Fragment>
                <ToolBarSeparator />
                <WindowButton icon={Icons.Minimize} onClick={minimizeWindow} />
                <WindowButton icon={Icons.Maximize} onClick={maximizeWindow} />
                <WindowButton icon={Icons.Close} onClick={closeWindow} />
              </React.Fragment>
            )}
            <Line />
          </ToolBar>
          <Pages />
        </StyledApp>
      </ThemeProvider>
    );
  }
}
