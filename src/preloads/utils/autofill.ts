import { IFormFillData } from '~/interfaces';
import { makeId } from '~/utils/string';

const passwords: Map<string, string> = new Map();

export const getUserPassword = (data: IFormFillData): Promise<string> => {
  return new Promise((resolve) => {
    const { url, fields } = data;
    const account = `${url}-${fields.username}`;
    const password = passwords.get(account);

    if (password) return resolve(password);

    const id = makeId(32);

    window.postMessage(
      {
        type: 'credentials-get-password',
        data: account,
        id,
      },
      '*',
    );

    window.addEventListener('message', (e) => {
      const { data } = e;

      if (data.type === 'result' && data.id === id) {
        passwords.set(account, data.result);
        resolve(data.result);
      }
    });
  });
};
