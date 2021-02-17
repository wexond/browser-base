import { ipcMain, dialog } from 'electron';
import * as Datastore from 'nedb';
import { fromBuffer } from 'file-type';
import * as icojs from 'icojs';

import { getPath } from '~/utils';
import {
  IFindOperation,
  IInsertOperation,
  IRemoveOperation,
  IUpdateOperation,
  IHistoryItem,
  IVisitedItem,
  IFavicon,
  IBookmark,
} from '~/interfaces';
import { countVisitedTimes } from '~/utils/history';
import { promises } from 'fs';
import { Application } from '../application';
import { requestURL } from '../network/request';
import * as parse from 'node-bookmarks-parser';

interface Databases {
  [key: string]: Datastore;
}

const convertIcoToPng = async (icoData: Buffer): Promise<ArrayBuffer> => {
  return (await icojs.parse(icoData, 'image/png'))[0].buffer;
};

const encodeHref = (str: string) => {
  return (str || '').replace(/"/g, '&quot;');
};

const encodeTitle = (str: string) => {
  return (str || '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

const indentLength = 4;
const indentType = ' ';

export class StorageService {
  public databases: Databases = {
    favicons: null,
    bookmarks: null,
    history: null,
    formfill: null,
    startupTabs: null,
    permissions: null,
  };

  public history: IHistoryItem[] = [];

  public bookmarks: IBookmark[] = [];

  public historyVisited: IVisitedItem[] = [];

  public favicons: Map<string, string> = new Map();

  public constructor() {
    ipcMain.handle('storage-get', async (e, data: IFindOperation) => {
      return await this.find(data);
    });

    ipcMain.handle('storage-get-one', async (e, data: IFindOperation) => {
      return await this.findOne(data);
    });

    ipcMain.handle('storage-insert', async (e, data: IInsertOperation) => {
      return await this.insert(data);
    });

    ipcMain.handle('storage-remove', async (e, data: IRemoveOperation) => {
      return await this.remove(data);
    });

    ipcMain.handle('storage-update', async (e, data: IUpdateOperation) => {
      return await this.update(data);
    });

    ipcMain.handle('import-bookmarks', async () => {
      const dialogRes = await dialog.showOpenDialog({
        filters: [{ name: 'Bookmark file', extensions: ['html'] }],
      });

      try {
        const file = await promises.readFile(dialogRes.filePaths[0], 'utf8');
        return parse(file);
      } catch (err) {
        console.error(err);
      }

      return [];
    });

    ipcMain.handle('export-bookmarks', async () => {
      await this.exportBookmarks();
    });

    ipcMain.handle('bookmarks-get', (e) => {
      return this.bookmarks;
    });

    ipcMain.on('bookmarks-remove', (e, ids: string[]) => {
      ids.forEach((x) => this.removeBookmark(x));
      Application.instance.windows.list.forEach((x) => {
        x.viewManager.selected.updateBookmark();
      });
    });

    ipcMain.handle('bookmarks-add', async (e, item) => {
      const b = await this.addBookmark(item);

      Application.instance.windows.list.forEach((x) => {
        x.viewManager.selected.updateBookmark();
      });

      return b;
    });

    ipcMain.handle('bookmarks-get-folders', async (e) => {
      return this.bookmarks.filter((x) => x.isFolder);
    });

    ipcMain.on('bookmarks-update', async (e, id, change) => {
      await this.updateBookmark(id, change);
    });

    ipcMain.handle('history-get', (e) => {
      return this.history;
    });

    ipcMain.on('history-remove', (e, ids: string[]) => {
      this.history = this.history.filter((x) => ids.indexOf(x._id) === -1);
      ids.forEach((x) => this.remove({ scope: 'history', query: { _id: x } }));
    });

    ipcMain.handle('topsites-get', (e, count) => {
      return this.historyVisited
        .filter((x) => x.title && x.title !== '')
        .slice(0, count);
    });
  }

  public find<T>(data: IFindOperation): Promise<T[]> {
    const { scope, query } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].find(query, (err: any, docs: any) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  }

  public findOne<T>(data: IFindOperation): Promise<T> {
    const { scope, query } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].findOne(query, (err: any, doc: any) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  public insert<T>(data: IInsertOperation): Promise<T> {
    const { scope, item } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].insert(item, (err: any, doc: any) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  public remove(data: IRemoveOperation): Promise<number> {
    const { scope, query, multi } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].remove(
        query,
        { multi },
        (err: any, removed: number) => {
          if (err) reject(err);
          resolve(removed);
        },
      );
    });
  }

  public update(data: IUpdateOperation): Promise<number> {
    const { scope, query, value, multi } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].update(
        query,
        { $set: value },
        { multi },
        (err: any, replaced: number) => {
          if (err) reject(err);
          resolve(replaced);
        },
      );
    });
  }

  public async run() {
    for (const key in this.databases) {
      this.databases[key] = this.createDatabase(key.toLowerCase());
    }
    this.loadBookmarks();
    await this.loadFavicons();
    this.loadHistory();
  }

  private async loadFavicons() {
    (await this.find<IFavicon>({ scope: 'favicons', query: {} })).forEach(
      (favicon) => {
        const { data } = favicon;

        if (this.favicons.get(favicon.url) == null) {
          this.favicons.set(favicon.url, data);
        }
      },
    );
  }

  private async loadHistory() {
    const items: IHistoryItem[] = await this.find({
      scope: 'history',
      query: {},
    });

    items.sort((a, b) => {
      let aDate = a.date;
      let bDate = b.date;

      if (typeof aDate === 'string') {
        aDate = new Date(a.date).getTime();
        bDate = new Date(b.date).getTime();
      }

      return aDate - bDate;
    });

    this.history = items;

    this.historyVisited = countVisitedTimes(items);

    this.historyVisited = this.historyVisited.map((x) => ({
      ...x,
      favicon: this.favicons.get(x.favicon),
    }));
  }

  private async loadBookmarks() {
    const items = await this.find<IBookmark>({ scope: 'bookmarks', query: {} });

    items.sort((a, b) => a.order - b.order);

    let barFolder = items.find((x) => x.static === 'main');
    let otherFolder = items.find((x) => x.static === 'other');
    let mobileFolder = items.find((x) => x.static === 'mobile');

    this.bookmarks = items;

    if (!barFolder) {
      barFolder = await this.addBookmark({
        static: 'main',
        isFolder: true,
      });

      for (const item of items) {
        if (!item.static) {
          await this.updateBookmark(item._id, { parent: barFolder._id });
        }
      }
    }

    if (!otherFolder) {
      otherFolder = await this.addBookmark({
        static: 'other',
        isFolder: true,
      });
    }

    if (!mobileFolder) {
      mobileFolder = await this.addBookmark({
        static: 'mobile',
        isFolder: true,
      });
    }
  }

  public removeBookmark(id: string) {
    const item = this.bookmarks.find((x) => x._id === id);

    if (!item) return;

    this.bookmarks = this.bookmarks.filter((x) => x._id !== id);
    const parent = this.bookmarks.find((x) => x._id === item.parent);

    parent.children = parent.children.filter((x) => x !== id);
    this.updateBookmark(item.parent, { children: parent.children });

    this.remove({ scope: 'bookmarks', query: { _id: id } });

    if (item.isFolder) {
      this.bookmarks = this.bookmarks.filter((x) => x.parent !== id);
      const removed = this.bookmarks.filter((x) => x.parent === id);

      this.remove({ scope: 'bookmarks', query: { parent: id }, multi: true });

      for (const i of removed) {
        if (i.isFolder) {
          this.removeBookmark(i._id);
        }
      }
    }
    Application.instance.windows.broadcast('reload-bookmarks');
  }

  public async updateBookmark(id: string, change: IBookmark) {
    const index = this.bookmarks.indexOf(
      this.bookmarks.find((x) => x._id === id),
    );
    this.bookmarks[index] = { ...this.bookmarks[index], ...change };

    await this.update({
      scope: 'bookmarks',
      query: { _id: id },
      value: change,
    });

    if (change.parent) {
      const parent = this.bookmarks.find((x) => x._id === change.parent);
      if (!parent.children.includes(change._id))
        await this.updateBookmark(parent._id, {
          children: [...parent.children, change._id],
        });
    }

    Application.instance.windows.broadcast('reload-bookmarks');
  }

  public async addBookmark(item: IBookmark): Promise<IBookmark> {
    if (item.parent === undefined) {
      item.parent = null;
    }

    if (item.parent === null && !item.static) {
      throw new Error('Parent bookmark should be specified');
    }

    if (item.isFolder) {
      item.children = item.children || [];
    } else {
    }

    if (item.order === undefined) {
      item.order = this.bookmarks.filter((x) => !Boolean(x.static)).length;
    }

    const doc = await this.insert<IBookmark>({ item, scope: 'bookmarks' });

    if (item.parent) {
      const parent = this.bookmarks.find((x) => x._id === item.parent);
      await this.updateBookmark(parent._id, {
        children: [...parent.children, doc._id],
      });
    }

    this.bookmarks.push(doc);

    Application.instance.windows.broadcast('reload-bookmarks');

    return doc;
  }

  private createDatabase = (name: string) => {
    return new Datastore({
      filename: getPath(`storage/${name}.db`),
      autoload: true,
    });
  };

  public addFavicon = async (url: string): Promise<string> => {
    if (!this.favicons.get(url)) {
      const res = await requestURL(url);

      if (res.statusCode === 404) {
        throw new Error('404 favicon not found');
      }

      let data = Buffer.from(res.data, 'binary');

      const type = await fromBuffer(data);

      if (type && type.ext === 'ico') {
        data = Buffer.from(new Uint8Array(await convertIcoToPng(data)));
      }

      const str = `data:${(await fromBuffer(data)).ext};base64,${data.toString(
        'base64',
      )}`;

      this.insert({
        scope: 'favicons',
        item: {
          url,
          data: str,
        },
      });

      this.favicons.set(url, str);

      return str;
    } else {
      return this.favicons.get(url);
    }
  };

  private createBookmarkArray = (
    parentFolderId: string = null,
    first = true,
    depth = 1,
  ): string[] => {
    let payload: string[] = [];
    let title;
    const bookmarks = this.bookmarks.filter((x) => x.parent === parentFolderId);
    const indentFirst = indentType.repeat(depth * indentLength);
    const indentNext = !first
      ? indentFirst
      : indentType.repeat((depth + 1) * indentLength);

    if (first) payload.push(`${indentFirst}<DL><p>`);

    for (const bookmark of bookmarks) {
      if (!bookmark.isFolder && bookmark.url) {
        title = encodeTitle(bookmark.title);
        const href = encodeHref(bookmark.url);
        let icon = bookmark.favicon;

        if (!icon.startsWith('data:')) {
          icon = this.favicons.get(icon);
        }

        payload.push(
          `${indentNext}<DT><A HREF="${href}" ICON="${icon}">${title}</A>`,
        );
      } else if (bookmark.isFolder) {
        title = encodeTitle(bookmark.title);
        payload.push(`${indentNext}<DT><H3>${title}</H3>`);
        payload = payload.concat(
          this.createBookmarkArray(bookmark._id, true, depth + 1),
        );
      }
    }

    if (first) payload.push(`${indentFirst}</DL><p>`);

    return payload;
  };

  public exportBookmarks = async () => {
    const { filePath, canceled } = await dialog.showSaveDialog({
      filters: [{ name: 'Bookmark file', extensions: ['html'] }],
    });

    if (canceled) return;

    const breakTag = process.platform === 'win32' ? '\r\n' : '\n';
    const documentTitle = 'Bookmarks';

    const bar = this.createBookmarkArray(
      this.bookmarks.find((x) => x.static === 'main')._id,
    );

    const other = this.createBookmarkArray(
      this.bookmarks.find((x) => x.static === 'other')._id,
      false,
    );

    const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
    It will be read and overwritten.
    DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>${documentTitle}</TITLE>
<H1>${documentTitle}</H1>
<DL><p>
    <DT><H3 PERSONAL_TOOLBAR_FOLDER="true">Bookmarks bar</H3>
${bar.join(breakTag)}
${other.join(breakTag)}
</DL><p>`;

    try {
      await promises.writeFile(filePath, html, 'utf8');
    } catch (err) {
      console.error(err);
    }
  };
}
