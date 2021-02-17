import { ipcRenderer } from 'electron';
import { toJS } from 'mobx';

interface IAction<T> {
  item?: Partial<T>;
  query?: Partial<T>;
  multi?: boolean;
  value?: Partial<T>;
}

export class Database<T> {
  private scope: string;

  public constructor(scope: string) {
    this.scope = scope;
  }

  private async performOperation(
    operation: 'get' | 'get-one' | 'update' | 'insert' | 'remove',
    data: IAction<T>,
  ): Promise<any> {
    const res = await ipcRenderer.invoke(`storage-${operation}`, {
      scope: this.scope,
      ...toJS(data),
    });

    return res;
  }

  public async insert(item: T): Promise<T> {
    return await this.performOperation('insert', { item });
  }

  public async get(query: T): Promise<T[]> {
    return await this.performOperation('get', { query });
  }

  public async getOne(query: T): Promise<T[]> {
    return await this.performOperation('get-one', { query });
  }

  public async update(query: T, newValue: T, multi = false): Promise<number> {
    return await this.performOperation('update', {
      query,
      value: newValue,
      multi,
    });
  }

  public async remove(query: T, multi = false): Promise<T> {
    return await this.performOperation('remove', { query, multi });
  }
}
