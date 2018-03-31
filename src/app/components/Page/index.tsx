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

    const updateInfo = ({ url, isMainFrame }: { url: string; isMainFrame: boolean }) => {
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

    webview.addEventListener(
      'page-title-updated',
      ({ title }: { title: string; explicitSet: string }) => {
        tab.title = title;
        updateData();
      },
    );

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
  }

  public render() {
    const { page, selected } = this.props;
    const { url } = page;

    return (
      <StyledPage selected={selected}>
        <webview src={url} style={{ height: '100%' }} ref={r => (page.webview = r)} />
      </StyledPage>
    );
  }
}
