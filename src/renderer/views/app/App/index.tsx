import {
  ipcRenderer, clipboard, remote, nativeImage,
} from 'electron';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import { createWriteStream, readdir, stat } from 'fs';
import { basename, extname, resolve } from 'path';
import http from 'http';
import { parse } from 'url';

import { StyledApp } from './styles';
import Pages from '../Pages';
import Toolbar from '../Toolbar';
import GlobalMenu from '../GlobalMenu';
import WorkspacesMenu from '../WorkspacesMenu';
import store from '../../../store';
import database from '../../../database';
import { ContextMenuMode, ButtonType } from '../../../enums';
import ContextMenu from '../../../components/ContextMenu';
import Snackbar from '../../../components/Snackbar';
import Button from '../../../components/Button';
import colors from '../../../defaults/colors';
import ipcMessages from '../../../defaults/ipc-messages';
import { getPath } from '../../../utils/paths';

const { dialog } = remote;

@observer
class App extends React.Component {
  private workspacesTimer: any;

  public onInspectElementClick = () => {
    const { x, y } = store.webviewContextMenuParams;
    store.getSelectedPage().webview.inspectElement(x, y);
  };

  public async componentDidMount() {
    window.addEventListener('mousemove', e => {
      store.mouse.x = e.pageX;
      store.mouse.y = e.pageY;
    });

    window.addEventListener('mousedown', (e: MouseEvent) => {
      store.pageMenu.toggle(false);
    });

    window.addEventListener('mouseup', (e: MouseEvent) => {
      store.bookmarkDialogVisible = false;
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'Meta') {
        store.cmdPressed = false;
      }
    });

    window.addEventListener('keydown', e => {
      if (!e.isTrusted) return;

      store.cmdPressed = e.key === 'Meta'; // Command on macOS

      if (e.keyCode === 27) {
        // escape
        // hide menu and workspaces manager

        if (store.workspacesMenuVisible) store.workspacesMenuVisible = false;

        if (store.menu.visible) {
          store.menu.visible = false;
          store.menu.selectedItem = null;
        }
      } else if (
        (e.ctrlKey || store.workspacesMenuVisible)
        && (e.keyCode === 37 || e.keyCode === 39)
      ) {
        // ctrl + left or aight arrow,
        // switch between workspaces

        const list = store.workspaces;
        const index = list.indexOf(store.getCurrentWorkspace());

        if (e.keyCode === 37) {
          // left

          if (index <= 0) {
            store.selectedWorkspace = list[list.length - 1].id;
          } else {
            store.selectedWorkspace = list[index - 1].id;
          }
        } else if (e.keyCode === 39) {
          // right

          if (index + 1 === store.workspaces.length) {
            store.selectedWorkspace = 0;
          } else {
            store.selectedWorkspace = list[index + 1].id;
          }
        } else {
          return;
        }

        clearTimeout(this.workspacesTimer);

        this.workspacesTimer = setTimeout(
          () => (store.workspacesMenuVisible = false),
          store.workspacesMenuVisible ? 500 : 200,
        );
        store.workspacesMenuVisible = true;
      } else if (e.ctrlKey && e.keyCode >= 48 && e.keyCode <= 57) {
        // ctrl + digit
        // switch between tabs, 1-9 + 0

        const current = store.getCurrentWorkspace();
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
      } else if (e.ctrlKey && e.keyCode === 83 && !store.workspacesMenuVisible) {
        // ctrl + s
        // show workspaces manager

        store.workspacesMenuVisible = true;
      } else if (e.ctrlKey && e.keyCode === 82) {
        // ctrl + r
        // refresh a page

        store.getSelectedPage().webview.reload();
      } else if (e.ctrlKey && e.keyCode === 78) {
        // ctrl + n
        // add a new tab

        store.getCurrentWorkspace().addTab();
      } else if (e.altKey && e.keyCode === 37) {
        // alt + left arrow
        // go back
        store.getSelectedPage().webview.goBack();
      } else if (e.altKey && e.keyCode === 39) {
        // alt + right arrow
        // go forward
        store.getSelectedPage().webview.goForward();
      } else if (e.ctrlKey && e.keyCode === 72) {
        // ctrl + h
        // To view history
        store.menu.visible = true;
        store.menu.selectedItem = 0;
      } else if (e.ctrlKey && e.keyCode === 75) {
        // ctrl + k
        // To view bookmarks
        store.menu.visible = true;
        store.menu.selectedItem = 1;
      } else if (e.altKey && e.keyCode === 36) {
        // alt + Home
        // To go NewTab Page
        store.getSelectedPage().webview.loadURL('wexond://newtab');
      } else if (e.altKey && e.keyCode === 112) {
        // alt + F1
        // To see About
        store.menu.visible = true;
        store.menu.selectedItem = 4;
      } else if (e.altKey && e.keyCode === 69) {
        // alt + E
        // Open Menu
        store.menu.visible = true;
      }
    });

    await store.loadFavicons();

    store.bookmarks = await database.bookmarks.toArray();
    store.historyItems = await database.history.toArray();
  }

  public componentWillUnmount() {
    store.pages = [];
  }

  public onRestartClick = () => {
    store.updateInfo.available = false;
    ipcRenderer.send(ipcMessages.UPDATE_RESTART_AND_INSTALL);
  };

  public onOpenLinkInNewTabClick = () => {
    const { linkURL } = store.webviewContextMenuParams;
    store.getCurrentWorkspace().addTab({ url: linkURL, active: false});
  };

  public onCopyLinkAddressClick = () => {
    const { linkURL } = store.webviewContextMenuParams;
    clipboard.clear();
    clipboard.writeText(linkURL);
  };

  public onOpenImageInNewTabClick = () => {
    const { srcURL } = store.webviewContextMenuParams;
    store.getCurrentWorkspace().addTab({ url: srcURL, active: false});
  };

  public onPrintClick = () => {
    store.getSelectedPage().webview.print();
  };

  public onCopyImageClick = () => {
    const { srcURL } = store.webviewContextMenuParams;
    const img = nativeImage.createFromDataURL(srcURL);

    clipboard.clear();
    clipboard.writeImage(img);
  };

  public onCopyImageAddressClick = () => {
    const { srcURL } = store.webviewContextMenuParams;
    clipboard.clear();
    clipboard.writeText(srcURL);
  };

  public onSaveImageAsClick = () => {
    const { srcURL } = store.webviewContextMenuParams;
    let name = basename(srcURL);
    let extension = extname(name);

    if (extension.trim() === '') {
      name = '';
      extension = srcURL.split('data:image/')[1].split(';base64,')[0];

      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (let i = 0; i < 16; i++) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
      }
    }

    dialog.showSaveDialog(
      {
        defaultPath: `${name}.${extension}`,
        filters: [
          {
            name: '',
            extensions: [extension],
          },
        ],
      },
      path => {
        const file = createWriteStream(path);

        const options = parse(srcURL);

        const request = http.request(options, res => {
          res.pipe(file);
        });
        request.end();
      },
    );
  };

  public saveLinkAs = () => {
    const url = store.webviewContextMenuParams.linkText;
    dialog.showSaveDialog(
      {
        defaultPath: `${url}.html`,
        filters: [
          {
            name: '.html',
            extensions: ['html'],
          },
        ],
      },
      path1 => {
        store
          .getSelectedPage()
          .webview.getWebContents()
          .savePage(path1, 'HTMLComplete', error => {
            if (error) {
              console.error(error);
            }
          });
      },
    );
  };

  public saveAs = () => {
    dialog.showSaveDialog(
      {
        defaultPath: `${store.getSelectedPage().webview.getTitle()}.html`,
        filters: [
          {
            name: '.html',
            extensions: ['html'],
          },
        ],
      },
      path1 => {
        store
          .getSelectedPage()
          .webview.getWebContents()
          .savePage(path1, 'HTMLComplete', error => {
            if (error) {
              console.error(error);
            }
          });
      },
    );
  };

  public viewSource = () => {
    const url = store.getSelectedPage().webview.getURL();
    store.getCurrentWorkspace().addTab({url: `view-source:${url}`, active: true });
  };

  public render() {
    const { mode } = store.pageMenuData;

    const imageAndURLLink = mode === ContextMenuMode.ImageAndURL || mode === ContextMenuMode.URL;
    const imageAndURLImage = mode === ContextMenuMode.ImageAndURL || mode === ContextMenuMode.Image;
    const normal = mode === ContextMenuMode.Normal;

    return (
      <StyledApp>
        <Toolbar />
        <Pages />
        <ContextMenu
          width={256}
          dense
          ref={(r: ContextMenu) => (store.pageMenu = r)}
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            left: store.pageMenuData.x,
            top: store.pageMenuData.y,
          }}
        >
          <ContextMenu.Item visible={imageAndURLLink} onClick={this.onOpenLinkInNewTabClick}>
            Open link in new tab
          </ContextMenu.Item>
          <ContextMenu.Item visible={imageAndURLLink} disabled>
            Open link in new window
          </ContextMenu.Item>
          <ContextMenu.Item visible={imageAndURLLink} disabled>
            Open link in new incognito window
          </ContextMenu.Item>
          <ContextMenu.Item visible={imageAndURLLink} onClick={this.saveLinkAs}>
            Save link as
          </ContextMenu.Item>
          <ContextMenu.Item visible={imageAndURLLink} onClick={this.onCopyLinkAddressClick}>
            Copy link address
          </ContextMenu.Item>
          <ContextMenu.Separator visible={imageAndURLLink} />
          <ContextMenu.Item visible={imageAndURLImage} onClick={this.onOpenImageInNewTabClick}>
            Open image in new tab
          </ContextMenu.Item>
          <ContextMenu.Item visible={imageAndURLImage} onClick={this.onSaveImageAsClick}>
            Save image as
          </ContextMenu.Item>
          <ContextMenu.Item visible={imageAndURLImage} onClick={this.onCopyImageClick}>
            Copy image
          </ContextMenu.Item>
          <ContextMenu.Item visible={imageAndURLImage} onClick={this.onCopyImageAddressClick}>
            Copy image address
          </ContextMenu.Item>
          <ContextMenu.Separator visible={imageAndURLImage} />
          <ContextMenu.Item visible={normal} onClick={this.onPrintClick}>
            Print
          </ContextMenu.Item>
          <ContextMenu.Item visible={normal} onClick={this.saveAs}>
            Save as
          </ContextMenu.Item>
          <ContextMenu.Separator visible={normal} />
          <ContextMenu.Item visible={normal} onClick={this.viewSource}>
            View source
          </ContextMenu.Item>
          <ContextMenu.Item onClick={this.onInspectElementClick}>Inspect element</ContextMenu.Item>
        </ContextMenu>
        <GlobalMenu />
        <WorkspacesMenu />
        <Snackbar visible={store.updateInfo.available}>
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
