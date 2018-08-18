import { clipboard, ipcRenderer, nativeImage, remote } from 'electron';
import { createWriteStream } from 'fs';
import http from 'http';
import { observer } from 'mobx-react';
import { basename, extname } from 'path';
import React from 'react';
import { parse } from 'url';

import { UPDATE_RESTART_AND_INSTALL } from 'constants/';
import Button from '../../../components/Button';
import ContextMenu from '../../../components/ContextMenu';
import Snackbar from '../../../components/Snackbar';
import GlobalMenu from '../GlobalMenu';
import Pages from '../Pages';
import Toolbar from '../Toolbar';
import WorkspacesMenu from '../WorkspacesMenu';
import { StyledApp } from './styles';
import { PageMenuMode } from 'enums';
import { colors } from 'defaults';
import store from '../../store';

const { dialog } = remote;

@observer
class App extends React.Component {
  public onInspectElementClick = () => {
    const { x, y } = store.webviewContextMenuParams;
    getSelectedPage().webview.inspectElement(x, y);
  };

  public async componentDidMount() {
    window.addEventListener('mousemove', this.onWindowMouseMove);
    window.addEventListener('mousedown', this.onWindowMouseDown);
    window.addEventListener('mouseup', this.onWindowMouseUp);

    // TODO: nedb
    /*await store.loadFavicons();
    store.bookmarks = await database.bookmarks.toArray();
    store.historyItems = await database.history.toArray();*/

    store.keyBindings = await getKeyBindings();
    bindKeys(store.keyBindings);
  }

  public onWindowMouseMove = (e: MouseEvent) => {
    store.mouse.x = e.pageX;
    store.mouse.y = e.pageY;
  };

  public onWindowMouseDown = (e: MouseEvent) => {
    store.pageMenuVisible = false;
  };

  public onWindowMouseUp = (e: MouseEvent) => {
    store.bookmarkDialogVisible = false;
  };

  public componentWillUnmount() {
    store.pages = [];

    window.removeEventListener('mousemove', this.onWindowMouseMove);
    window.removeEventListener('mousedown', this.onWindowMouseDown);
    window.removeEventListener('mouseup', this.onWindowMouseUp);
  }

  public onRestartClick = () => {
    store.updateInfo.available = false;
    ipcRenderer.send(UPDATE_RESTART_AND_INSTALL);
  };

  public onOpenLinkInNewTabClick = () => {
    const { linkURL } = store.webviewContextMenuParams;
    createTab({ url: linkURL, active: false });
  };

  public onCopyLinkAddressClick = () => {
    const { linkURL } = store.webviewContextMenuParams;
    clipboard.clear();
    clipboard.writeText(linkURL);
  };

  public onOpenImageInNewTabClick = () => {
    const { srcURL } = store.webviewContextMenuParams;
    createTab({ url: srcURL, active: false });
  };

  public onPrintClick = () => {
    getSelectedPage().webview.print();
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

      const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

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
        getSelectedPage()
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
        defaultPath: `${getSelectedPage().webview.getTitle()}.html`,
        filters: [
          {
            name: '.html',
            extensions: ['html'],
          },
        ],
      },
      path1 => {
        getSelectedPage()
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
    const url = getSelectedPage().webview.getURL();
    createTab({ url: `view-source:${url}`, active: true });
  };

  public render() {
    const { mode } = store.pageMenuData;

    const imageAndURLLink =
      mode === PageMenuMode.ImageAndURL || mode === PageMenuMode.URL;
    const imageAndURLImage =
      mode === PageMenuMode.ImageAndURL || mode === PageMenuMode.Image;
    const normal = mode === PageMenuMode.Normal;

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
          visible={store.pageMenuVisible}
        >
          <ContextMenu.Item
            visible={imageAndURLLink}
            onClick={this.onOpenLinkInNewTabClick}
          >
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
          <ContextMenu.Item
            visible={imageAndURLLink}
            onClick={this.onCopyLinkAddressClick}
          >
            Copy link address
          </ContextMenu.Item>
          <ContextMenu.Separator visible={imageAndURLLink} />
          <ContextMenu.Item
            visible={imageAndURLImage}
            onClick={this.onOpenImageInNewTabClick}
          >
            Open image in new tab
          </ContextMenu.Item>
          <ContextMenu.Item
            visible={imageAndURLImage}
            onClick={this.onSaveImageAsClick}
          >
            Save image as
          </ContextMenu.Item>
          <ContextMenu.Item
            visible={imageAndURLImage}
            onClick={this.onCopyImageClick}
          >
            Copy image
          </ContextMenu.Item>
          <ContextMenu.Item
            visible={imageAndURLImage}
            onClick={this.onCopyImageAddressClick}
          >
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
          <ContextMenu.Item onClick={this.onInspectElementClick}>
            Inspect element
          </ContextMenu.Item>
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

export default App;
