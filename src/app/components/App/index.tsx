import {
  ipcRenderer, clipboard, remote, nativeImage,
} from 'electron';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import { createWriteStream } from 'fs';
import { basename, extname } from 'path';
import http from 'http';
import { parse } from 'url';

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
import { ContextMenuMode } from '../../enums';

const { dialog } = remote;

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

  public onOpenLinkInNewTabClick = () => {
    const { linkURL } = Store.webviewContextMenuParams;
    Store.getCurrentWorkspace().addTab(linkURL, false);
  };

  public onCopyLinkAddressClick = () => {
    const { linkURL } = Store.webviewContextMenuParams;
    clipboard.clear();
    clipboard.writeText(linkURL);
  };

  public onOpenImageInNewTabClick = () => {
    const { srcURL } = Store.webviewContextMenuParams;
    Store.getCurrentWorkspace().addTab(srcURL, false);
  };

  public onPrintClick = () => {
    Store.getSelectedPage().webview.print();
  };

  public onCopyImageClick = () => {
    const { srcURL } = Store.webviewContextMenuParams;
    const img = nativeImage.createFromDataURL(srcURL);

    clipboard.clear();
    clipboard.writeImage(img);
  };

  public onCopyImageAddressClick = () => {
    const { srcURL } = Store.webviewContextMenuParams;
    clipboard.clear();
    clipboard.writeText(srcURL);
  };

  public onSaveImageAsClick = () => {
    const { srcURL } = Store.webviewContextMenuParams;
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
    const url = Store.webviewContextMenuParams.linkText;
    dialog.showSaveDialog({
      defaultPath:url + '.html',
      filters: [
        {
          name: '.html',
          extensions: ['html'],
        }
      ]
    },
      function (path1) {
        Store.getSelectedPage().webview.getWebContents().savePage(path1, 'HTMLComplete', (error) => {
          if (error) {
            console.error(error)
          }
        })
      }
    )
  };

  public saveAs = () => {
    dialog.showSaveDialog({
      defaultPath: Store.getSelectedPage().webview.getTitle() + '.html',
      filters: [
        {
          name: '.html',
          extensions: ['html'],
        }
      ]
    },
      function (path1) {
        Store.getSelectedPage().webview.getWebContents().savePage(path1, 'HTMLComplete', (error) => {
          if (error) {
            console.error(error)
          }
        })
      }
    )
  };

  public viewSource = () => {
    const url = Store.getSelectedPage().webview.getURL();
    Store.getCurrentWorkspace().addTab('view-source:' + url, true);
  };

  public render() {
    const { mode } = Store.pageMenuData;

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
          ref={(r: ContextMenu) => (Store.pageMenu = r)}
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            left: Store.pageMenuData.x,
            top: Store.pageMenuData.y,
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
          <ContextMenu.Item visible={normal} onClick={this.viewSource} >
            View source
          </ContextMenu.Item>
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
