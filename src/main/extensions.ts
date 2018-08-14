import { webContents } from 'electron';
import { readdirSync, readFileSync, statSync } from 'fs';
import { format } from 'url';

import { Manifest } from '../interfaces';
import { makeId } from '../utils/other';
import { Global } from './interfaces';
import { getPath } from '../utils/paths';
import { join, resolve } from 'path';

declare const global: Global;

export const startBackgroundPage = (manifest: Manifest) => {
  if (manifest.background) {
    const { background, extensionId } = manifest;
    const { page, scripts } = background;
    const { srcDirectory } = manifest;

    let html = Buffer.from('');
    let name;

    if (page) {
      name = page;
      html = readFileSync(resolve(srcDirectory, page));
    } else if (scripts) {
      name = 'generated.html';
      html = Buffer.from(
        `<html>
          <body>${scripts
            .map(script => `<script src="${script}"></script>`)
            .join('')}
          </body>
        </html>`,
        'utf8',
      );
    }

    // The create method doesn't exist in the WebContents type.
    const contents = (webContents as any).create({
      partition: 'persist:wexond_extension',
      isBackgroundPage: true,
      commandLineSwitches: ['--background-page'],
      preload: resolve(__dirname, 'build/background-page-preload.js'),
    });

    global.backgroundPages[extensionId] = {
      html,
      name,
      webContentsId: contents.id,
    };

    contents.openDevTools({ mode: 'detach' });

    contents.loadURL(
      format({
        protocol: 'wexond-extension',
        slashes: true,
        hostname: extensionId,
        pathname: name,
      }),
    );
  }
};

export const loadExtensions = () => {
  const extensionsPath = getPath('extensions');
  const files = readdirSync(extensionsPath);

  for (const dir of files) {
    const extensionPath = resolve(extensionsPath, dir);
    console.log(extensionPath);
    const stats = statSync(extensionPath);

    if (stats.isDirectory()) {
      const manifestPath = resolve(extensionPath, 'manifest.json');
      const manifest: Manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

      manifest.extensionId = makeId(32);
      manifest.srcDirectory = extensionPath;

      global.extensions[manifest.extensionId] = manifest;

      startBackgroundPage(manifest);
    }
  }
};
