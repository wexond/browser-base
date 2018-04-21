import { observer } from 'mobx-react';
import React from 'react';
import StyledPage from './styles';
import Page from '../../models/page';
import Store from '../../store';
import { addFavicon, history } from '../../utils/storage';

interface Props {
  page: Page;
  selected: boolean;
}

@observer
export default class extends React.Component<Props, {}> {
  public componentDidMount() {
    const { page } = this.props;
    const { webview, id } = page;
    const tab = Store.getTabById(id);

    let historyId = -1;
    let lastURL = '';

    const updateData = async () => {
      if (lastURL === tab.url) {
        if (historyId !== -1) {
          const query = 'UPDATE history SET title = ?, url = ?, favicon = ? WHERE rowid = ?';
          const data = [tab.title, webview.getURL(), tab.favicon, historyId];
          history.run(query, data);
        }
      }
    };

    const updateInfo = ({ isMainFrame, url }: any) => {
      Store.refreshNavigationState();

      if (!isMainFrame && !url) return;
      tab.url = url;
      updateData();
    };

    webview.addEventListener('did-stop-loading', (e: any) => {
      updateInfo(e);
      tab.loading = false;
    });
    webview.addEventListener('did-navigate', updateInfo);
    webview.addEventListener('did-navigate-in-page', updateInfo);
    webview.addEventListener('will-navigate', updateInfo);

    webview.addEventListener('page-title-updated', ({ title }) => {
      tab.title = title;
      updateData();
    });

    webview.addEventListener(
      'load-commit',
      ({ url, isMainFrame }: { url: string; isMainFrame: boolean }) => {
        tab.loading = true;

        if (url !== lastURL && isMainFrame) {
          history.run(
            "INSERT INTO history(title, url, favicon, date) VALUES (?, ?, ?, DATETIME('now', 'localtime'))",
            [tab.title, url, tab.favicon],
            function callback() {
              historyId = this.lastID;
            },
          );
          lastURL = url;
        }
      },
    );

    webview.addEventListener('page-favicon-updated', ({ favicons }: { favicons: string[] }) => {
      const request = new XMLHttpRequest();
      request.onreadystatechange = async () => {
        if (request.readyState === 4) {
          if (request.status === 404) {
            tab.favicon = '';
          } else {
            tab.favicon = favicons[0];
            addFavicon(favicons[0]);
          }
        }
        updateData();
      };

      request.open('GET', favicons[0], true);
      request.send(null);
    });

    const onContextMenu = (e: Electron.Event, params: Electron.ContextMenuParams) => {
      requestAnimationFrame(() => {
        Store.pageMenu.toggle(true);
      });

      Store.contextMenuParams = params;

      // Calculate new menu position
      // using cursor x, y and
      // width, height of the menu.
      const x = Store.mouse.x;
      const y = Store.mouse.y;

      // By default it opens menu from upper left corner.
      let left = x;
      let top = y;

      const width = 3 * 64;
      const height = Store.pageMenu.getHeight();

      // Open menu from right corner.
      if (left + width > window.innerWidth) {
        left = x - width;
      }

      // Open menu from bottom corner.
      if (top + height > window.innerHeight) {
        top = y - height;
      }

      if (top < 0) {
        top = 96;
      }

      // Set the new position.
      Store.pageMenuData.x = left;
      Store.pageMenuData.y = top;
    };

    // When webcontents of a webview are not available,
    // we can't use them, so we need to check if
    // these webcontents are not null,
    // and then use them.
    const checkWebcontentsInterval = setInterval(() => {
      // We need to use webcontents,
      // to add an event listener `context-menu`.
      if (webview.getWebContents() != null) {
        webview.getWebContents().on('context-menu', onContextMenu);

        // When these webcontents are finally not null,
        // just remove the interval.
        clearInterval(checkWebcontentsInterval);
      }
    }, 1);
  }

  public render() {
    const { page, selected } = this.props;
    const { url } = page;

    return (
      <StyledPage selected={selected}>
        <webview
          src={url}
          style={{ height: '100%' }}
          ref={(r: Electron.WebviewTag) => (page.webview = r)}
          preload="../../src/app/preloads/index.js"
        />
      </StyledPage>
    );
  }
}
