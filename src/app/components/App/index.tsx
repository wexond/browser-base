import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';

import { StyledApp } from './styles';
import Store from '../../store';
import Pages from '../Pages';
import Toolbar from '../Toolbar';
import GlobalMenu from '../GlobalMenu';
import WorkspacesMenu from '../WorkspacesMenu';
import ContextMenu from '../../../shared/components/ContextMenu';
import db from '../../../shared/models/app-database';
import Snackbar from '../../../shared/components/Snackbar';
import Button from '../../../shared/components/Button';
import { ButtonType } from '../../../shared/enums';
import colors from '../../../shared/defaults/colors';
import ipcMessages from '../../../shared/defaults/ipc-messages';

@observer
class App extends React.Component {
  public onInspectElementClick = () => {
    const { x, y } = Store.webviewContextMenuParams;
    Store.getSelectedPage().webview.inspectElement(x, y);
  };

  public async componentDidMount() {
    window.addEventListener('mousemove', e => {
      Store.mouse.x = e.pageX;
      Store.mouse.y = e.pageY;
    });

    window.addEventListener('mousedown', (e: MouseEvent) => {
      Store.pageMenu.toggle(false);
    });

    window.addEventListener('mouseup', (e: MouseEvent) => {
      Store.bookmarksDialogVisible = false;
    });

    window.addEventListener('keydown', e => {
      if (!e.isTrusted) return;
      const { workspaces, menu } = Store;

      if (e.keyCode === 27) {
        // escape
        // hide menu and workspaces manager

        if (workspaces.visible) workspaces.visible = false;

        if (menu.visible) {
          menu.visible = false;
          menu.selectedItem = null;
        }
      } else if ((e.ctrlKey || workspaces.visible) && (e.keyCode === 37 || e.keyCode === 39)) {
        // ctrl + left or aight arrow,
        // switch between workspaces

        const list = workspaces.list;
        const index = list.indexOf(Store.getCurrentWorkspace());

        if (e.keyCode === 37) {
          // left

          if (index <= 0) {
            workspaces.selected = list[list.length - 1].id;
          } else {
            workspaces.selected = list[index - 1].id;
          }
        } else if (e.keyCode === 39) {
          // right

          if (index + 1 === workspaces.list.length) {
            workspaces.selected = 0;
          } else {
            workspaces.selected = list[index + 1].id;
          }
        } else {
          return;
        }

        clearTimeout(workspaces.timer);

        workspaces.timer = setTimeout(workspaces.hide, workspaces.visible ? 500 : 200);
        workspaces.visible = true;
      } else if (e.ctrlKey && e.keyCode >= 48 && e.keyCode <= 57) {
        // ctrl + digit
        // switch between tabs, 1-9 + 0

        const current = Store.getCurrentWorkspace();
        const tabs = current.tabs;

        if (e.keyCode === 48) {
          // 0

          current.selectTab(tabs[tabs.length - 1]);
        } else {
          // 1-9

          const index = e.keyCode - 49;

          if (tabs.length > index) {
            current.selectTab(tabs[index]);
          }
        }
      } else if (e.ctrlKey && e.keyCode === 83 && !workspaces.visible) {
        // ctrl + s
        // show workspaces manager

        workspaces.visible = true;
      } else if (e.ctrlKey && e.keyCode === 82) {
        // ctrl + r
        // refresh a page

        Store.getSelectedPage().webview.reload();
      } else if (e.ctrlKey && e.keyCode === 78) {
        // ctrl + n
        // add a new tab

        Store.getCurrentWorkspace().addTab();
      }
    });

    Store.bookmarks = await db.bookmarks.toArray();
  }

  public componentWillUnmount() {
    Store.pages = [];
  }

  public onRestartClick = () => {
    Store.updateInfo.available = false;
    ipcRenderer.send(ipcMessages.UPDATE_RESTART_AND_INSTALL);
  };

  public render() {
    return (
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
          <ContextMenu.Item onClick={this.onInspectElementClick}>Inspect element</ContextMenu.Item>
        </ContextMenu>
        <GlobalMenu />
        <WorkspacesMenu />
        <Snackbar visible={Store.updateInfo.available}>
          <Snackbar.Content>An update is available</Snackbar.Content>
          <Snackbar.Actions>
            <Button
              type={ButtonType.Text}
              foreground={colors.blue['500']}
              onClick={this.onRestartClick}
            >
              RESTART
            </Button>
          </Snackbar.Actions>
        </Snackbar>
      </StyledApp>
    );
  }
}

export default hot(module)(App);
