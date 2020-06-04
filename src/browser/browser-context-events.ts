import { BrowserContext } from './browser-context';

export const hookBrowserContextEvents = (browserContext: BrowserContext) => {
  browserContext.session.setPermissionRequestHandler(
    async (webContents, permission, callback, details) => {
      const window = Application.instance.windows.findByBrowserView(
        webContents.id,
      );

      if (webContents.id !== window.viewManager.selectedId) return;

      if (permission === 'fullscreen') {
        callback(true);
      } else {
        try {
          const { hostname } = url.parse(details.requestingUrl);
          const perm: any = await Application.instance.storage.findOne({
            scope: 'permissions',
            query: {
              url: hostname,
              permission,
              mediaTypes: JSON.stringify(details.mediaTypes) || '',
            },
          });

          if (!perm) {
            const response = await requestPermission(
              window.win,
              permission,
              webContents.getURL(),
              details,
              webContents.id,
            );

            callback(response);

            await Application.instance.storage.insert({
              scope: 'permissions',
              item: {
                url: hostname,
                permission,
                type: response ? 1 : 2,
                mediaTypes: JSON.stringify(details.mediaTypes) || '',
              },
            });
          } else {
            callback(perm.type === 1);
          }
        } catch (e) {
          callback(false);
        }
      }
    },
  );

  const getDownloadItem = (
    item: Electron.DownloadItem,
    id: string,
  ): IDownloadItem => ({
    fileName: basename(item.savePath),
    receivedBytes: item.getReceivedBytes(),
    totalBytes: item.getTotalBytes(),
    savePath: item.savePath,
    id,
  });

  const downloadsDialog = () =>
    Application.instance.dialogs.getDynamic('downloads-dialog')?.browserView
      ?.webContents;

  const downloads: IDownloadItem[] = [];

  ipcMain.handle('get-downloads', () => {
    return downloads;
  });

  // TODO(sentialx): clean up the download listeners
  this.view.on('will-download', (event, item, webContents) => {
    const fileName = item.getFilename();
    const id = makeId(32);
    const window = Application.instance.windows.findByBrowserView(
      webContents.id,
    );

    if (!Application.instance.settings.object.downloadsDialog) {
      const downloadsPath = Application.instance.settings.object.downloadsPath;
      let i = 1;
      let savePath = resolve(downloadsPath, fileName);

      while (existsSync(savePath)) {
        const { name, ext } = parse(fileName);
        savePath = resolve(downloadsPath, `${name} (${i})${ext}`);
        i++;
      }

      item.savePath = savePath;
    }

    const downloadItem = getDownloadItem(item, id);
    downloads.push(downloadItem);

    downloadsDialog()?.send('download-started', downloadItem);
    window.send('download-started', downloadItem);

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed');
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused');
        }
      }

      const data = getDownloadItem(item, id);

      downloadsDialog()?.send('download-progress', data);
      window.send('download-progress', data);

      Object.assign(downloadItem, data);
    });
    item.once('done', async (event, state) => {
      if (state === 'completed') {
        const dialog = downloadsDialog();
        dialog?.send('download-completed', id);
        window.send('download-completed', id, !!dialog);

        downloadItem.completed = true;

        if (process.env.ENABLE_EXTENSIONS && extname(fileName) === '.crx') {
          const crxBuf = await promises.readFile(item.savePath);
          const crxInfo = parseCrx(crxBuf);

          if (!crxInfo.id) {
            crxInfo.id = makeId(32);
          }

          const extensionsPath = getPath('extensions');
          const path = resolve(extensionsPath, crxInfo.id);
          const manifestPath = resolve(path, 'manifest.json');

          if (await pathExists(path)) {
            console.log('Extension is already installed');
            return;
          }

          await extractZip(crxInfo.zip, path);

          const extension = await this.view.loadExtension(path);

          if (crxInfo.publicKey) {
            const manifest = JSON.parse(
              await promises.readFile(manifestPath, 'utf8'),
            );

            manifest.key = crxInfo.publicKey.toString('base64');

            await promises.writeFile(
              manifestPath,
              JSON.stringify(manifest, null, 2),
            );
          }

          window.send('load-browserAction', extension);
        }
      } else {
        console.log(`Download failed: ${state}`);
      }
    });
  });
};
