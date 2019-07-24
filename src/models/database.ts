import { ipcRenderer } from 'electron';

import { makeId } from '~/utils';

export class Database<T> {
  constructor(public scope: string) { }

  private async performOperation(
    operation: 'get' | 'update' | 'insert' | 'remove',
    data: any,
  ): Promise<any> {
    return new Promise(resolve => {
      const id = makeId(32);

      ipcRenderer.send(`storage-${operation}`, id, { scope: this.scope, ...data });

      ipcRenderer.once(id, (e, res: any) => {
        resolve(res);
      });
    });
  }

  public async insert(item: T): Promise<T> {
    return await this.performOperation('insert', { item });
  }

  public async get(query: T): Promise<T[]> {
    return await this.performOperation('get', { query });
  }

  public async update(query: T, newValue: T, multi = false): Promise<number> {
    return await this.performOperation('update', { query, value: newValue, multi });
  }

  public async remove(query: T, multi = false): Promise<T> {
    return await this.performOperation('remove', { query, multi });
  }
}
