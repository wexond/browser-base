import { getPassword, setPassword, deletePassword } from 'keytar';

import {
  IAutoFillItem,
  IAutoFillCredentialsData,
  IAutoFillMenuItem,
  IAutoFillType,
} from '~/interfaces';
import { Application } from '../application';

export class AutoFillService {
  public async getCredentials(
    hostname: string,
  ): Promise<IAutoFillCredentialsData> {
    const res = await Application.instance.storage.findOne<IAutoFillItem>({
      scope: 'formfill',
      query: {
        url: hostname,
      } as IAutoFillItem,
    });

    if (res == null) {
      return null;
    }

    const { username } = res.data as IAutoFillCredentialsData;
    const password = await getPassword(`wexond`, `${hostname}-${username}`);

    return { username, password };
  }

  public async saveCredentials(
    hostname: string,
    { username, password }: IAutoFillCredentialsData,
    favicon?: string,
  ) {
    const item: IAutoFillItem = {
      type: 'password',
      url: hostname,
      data: {
        username,
        passwordLength: password.length,
      },
      favicon,
    };

    await Application.instance.storage.insert<IAutoFillItem>({
      scope: 'formfill',
      item,
    });

    await setPassword(`wexond`, `${hostname}-${username}`, password);
  }

  public async updateCredentials(
    hostname: string,
    { username, password }: IAutoFillCredentialsData,
    oldUsername: string,
  ) {
    await Application.instance.storage.update({
      scope: 'formfill',
      query: {
        type: 'password',
        url: hostname,
        'data.username': oldUsername,
        'data.passwordLength': password.length,
      },
      value: {
        'data.username': username,
      },
    });

    if (oldUsername !== username) {
      await deletePassword(`wexond`, `${hostname}-${oldUsername}`);
    }

    await setPassword(`wexond`, `${hostname}-${username}`, password);
  }

  public async getMenuCredentialsItems(
    hostname: string,
    name: string,
    value = '',
  ): Promise<IAutoFillMenuItem[]> {
    const res = await Application.instance.storage.find<IAutoFillItem>({
      scope: 'formfill',
      query: {
        type: this.getType(name),
        url: hostname,
      } as IAutoFillItem,
    });

    const list: IAutoFillMenuItem[] = [];

    res.forEach(r => {
      const data = r.data as IAutoFillCredentialsData;

      if (data.username.startsWith(value)) {
        list.push({
          _id: r._id,
          favicon: r.favicon,
          label: data.username,
          sublabel: '•'.repeat(data.passwordLength),
        });
      }
    });

    return list;
  }

  public async getMenuAddressItems(
    hostname: string,
    name: string,
    value = '',
  ): Promise<IAutoFillMenuItem[]> {
    return [];
  }

  private getType(name: string): IAutoFillType {
    return name === 'username' ||
      name === 'login' ||
      name === 'email' ||
      name === 'password'
      ? 'password'
      : 'address';
  }
}
