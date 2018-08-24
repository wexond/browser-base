import { Manifest } from '~/interfaces';
import { getPath } from '~/utils/paths';
import { defaultPaths } from '~/defaults/paths';
import { existsSync, mkdirSync } from 'fs';
import Nedb from 'nedb';
import { join } from 'path';

export const getExtensionDatabases = (manifest: Manifest) => {
  const extensionStoragePath = getPath(
    defaultPaths.extensionsStorage,
    manifest.extensionId,
  );

  if (!existsSync(extensionStoragePath)) {
    mkdirSync(extensionStoragePath);
  }

  const local = new Nedb({
    filename: join(defaultPaths.extensionsStorage, 'local.db'),
    autoload: true,
  });

  return {
    local,
  };
};
