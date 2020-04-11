import { getPassword, setPassword, deletePassword } from 'keytar';

import {
  IAutoFillItem,
  IAutoFillCredentialsData,
  IAutoFillSavePayload,
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
        'fields.username': oldUsername,
        'fields.passLength': password.length,
      },
      value: {
        'fields.username': username,
      },
    });

    await setPassword(`wexond`, `${hostname}-${username}`, password);
  }
}
