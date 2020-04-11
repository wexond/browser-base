import { makeId } from '~/utils/string';

interface IAction<T> {
  item?: Partial<T>;
  query?: Partial<T>;
  multi?: boolean;
  value?: Partial<T>;
}

export class PreloadDatabase<T> {
  private scope: string;

  public constructor(scope: string) {
    this.scope = scope;
  }

  private async performOperation(
    operation: 'get' | 'get-one' | 'update' | 'insert' | 'remove',
    data: IAction<T>,
  ): Promise<any> {
    return new Promise((resolve) => {
      const id = makeId(32);

      window.postMessage(
        {
          type: 'storage',
          scope: this.scope,
          operation,
          data,
          id,
        },
        '*',
      );

      window.addEventListener('message', (e) => {
        const { data } = e;

        if (data.type === 'result' && data.id === id) {
          resolve(data.result);
        }
      });
    });
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
