import { mkdirSync } from 'fs';
import { sep, resolve, isAbsolute } from 'path';
import levelup, { LevelUp } from 'levelup';
import leveldown from 'leveldown';

function mkDirByPathSync(targetDir: any, { isRelativeToScript = false } = {}) {
  const initDir = isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir: any, childDir: any) => {
    const curDir = resolve(baseDir, parentDir, childDir);
    try {
      mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') {
        return curDir;
      }
      if (err.code === 'ENOENT') {
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || (caughtErr && targetDir === curDir)) {
        throw err;
      }
    }

    return curDir;
  }, initDir);
}

export class StorageArea {
  public db: LevelUp;

  private path: string;

  constructor(path: string) {
    this.path = path;

    mkDirByPathSync(path);

    this.db = (levelup as any)(leveldown(this.path));
  }

  public get(query: any, callback: (data: any) => void) {
    if (query === null) {
      const result: any = {};

      this.db
        .createReadStream()
        .on('data', (data: any) => {
          result[data.key] = data.value;
        })
        .on('end', () => {
          callback(result);
        });
    } else if (Array.isArray(query)) {
      const result: any = {};

      this.db
        .createReadStream()
        .on('data', (data: any) => {
          for (const key of query) {
            if (key === data.key) {
              result[data.key] = data.value;
            }
          }
        })
        .on('end', () => {
          callback(result);
        });
    } else if (typeof query === 'object') {
      const result: any = { ...query };

      this.db
        .createReadStream()
        .on('data', (data: any) => {
          for (const key in query) {
            if (key === data.key && data.value !== undefined) {
              result[data.key] = data.value;
            }
          }
        })
        .on('end', () => {
          callback(result);
        });
    } else if (typeof query === 'string') {
      this.db.get(query, (err: any, value) => {
        if (err) {
          if (err.notFound) {
            return callback({});
          }
        }

        callback({ [query]: value });
      });
    } else {
      callback({});
    }
  }

  public set(items: any, callback: any) {
    if (items === Object(items)) {
      const batch = this.db.batch();

      for (const key in items) {
        batch.put(key, JSON.stringify(items[key]).toString());
      }

      batch.write(() => {
        callback();
      });
    }
  }

  public remove(keys: any, callback: any) {
    if (typeof keys === 'string') {
      this.db.del(keys, err => {
        callback();
      });
    } else if (Array.isArray(keys)) {
      const batch = this.db.batch();

      for (const key of keys) {
        batch.del(key);
      }

      batch.write(() => {
        callback();
      });
    } else {
      // error
    }
  }

  public clear(callback: any) {
    this.get(null, data => {
      const batch = this.db.batch();
      for (const key in data) {
        batch.del(key);
      }
      batch.write(() => {
        callback();
      });
    });
  }
}
