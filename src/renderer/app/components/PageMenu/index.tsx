import * as React from 'react';
import { remote, clipboard, nativeImage } from 'electron';
import { createWriteStream } from 'fs';
import { parse } from 'url';
import { basename, extname } from 'path';
import * as http from 'http';
import { observer } from 'mobx-react';

import ContextMenu from '@/components/ContextMenu';
import store from '@app/store';
import { PageMenuMode } from '@/enums/app';

const { dialog } = remote;

@observer
export default class PageMenu extends React.Component {
  public onInspectElementClick = () => {
    const { x, y } = store.pageMenuStore.params;
    store.pagesStore.getSelected().webview.inspectElement(x, y);
  };

  public onOpenLinkInNewTabClick = () => {
    const { linkURL } = store.pageMenuStore.params;
    store.tabsStore.addTab({ url: linkURL, active: false });
  };

  public onCopyLinkAddressClick = () => {
    const { linkURL } = store.pageMenuStore.params;
    clipboard.clear();
    clipboard.writeText(linkURL);
  };

  public onOpenImageInNewTabClick = () => {
    const { srcURL } = store.pageMenuStore.params;
    store.tabsStore.addTab({ url: srcURL, active: false });
  };

  public onPrintClick = () => {
    store.pagesStore.getSelected().webview.print();
  };

  public onCopyImageClick = () => {
    const { srcURL } = store.pageMenuStore.params;
    const img = nativeImage.createFromDataURL(srcURL);

    clipboard.clear();
    clipboard.writeImage(img);
  };

  public onCopyImageAddressClick = () => {
    const { srcURL } = store.pageMenuStore.params;
    clipboard.clear();
    clipboard.writeText(srcURL);
  };

  public onSaveImageAsClick = () => {
    const { srcURL } = store.pageMenuStore.params;
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
    const url = store.pageMenuStore.params.linkText;
    const { webview } = store.pagesStore.getSelected();

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
        webview
          .getWebContents()
          .savePage(path1, 'HTMLComplete', (error: any) => {
            if (error) {
              console.error(error);
            }
          });
      },
    );
  };

  public saveAs = () => {
    const { webview } = store.pagesStore.getSelected();

    dialog.showSaveDialog(
      {
        defaultPath: `${webview.getTitle()}.html`,
        filters: [
          {
            name: '.html',
            extensions: ['html'],
          },
        ],
      },
      path1 => {
        webview
          .getWebContents()
          .savePage(path1, 'HTMLComplete', (error: any) => {
            if (error) {
              console.error(error);
            }
          });
      },
    );
  };

  public viewSource = () => {
    const url = store.pagesStore.getSelected().webview.getURL();
    store.tabsStore.addTab({ url: `view-source:${url}`, active: true });
  };

  public render() {
    const { mode } = store.pageMenuStore;

    const imageAndURLLink =
      mode === PageMenuMode.ImageAndURL || mode === PageMenuMode.URL;
    const imageAndURLImage =
      mode === PageMenuMode.ImageAndURL || mode === PageMenuMode.Image;
    const normal = mode === PageMenuMode.Normal;

    return (
      <ContextMenu
        width={300}
        ref={(r: ContextMenu) => (store.pageMenuStore.ref = r)}
        onMouseDown={e => e.stopPropagation()}
        onClick={() => (store.pageMenuStore.visible = false)}
        style={{
          position: 'absolute',
          left: store.pageMenuStore.x,
          top: store.pageMenuStore.y,
        }}
        visible={store.pageMenuStore.visible}
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
    );
  }
}
