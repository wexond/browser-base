import { parse } from 'url';

import { IFormFillData } from '~/interfaces';
import { getFormFillValue, getFormFillSubValue } from '~/utils/form-fill';
import { Application } from '../application';

const getType = (name: string) => {
  return name === 'username' || name === 'login' || name === 'password'
    ? 'password'
    : 'address';
};

export const getFormFillMenuItems = async (name: string, value: string) => {
  const dataType = getType(name);
  const { url } = Application.instance.windows.current.viewManager.selected;
  const { hostname } = parse(url);

  const items = await Application.instance.storage.find<IFormFillData>({
    scope: 'formfill',
    query: {
      type: dataType,
    },
  });

  return items
    .map((item: IFormFillData) => {
      const text = getFormFillValue(name, item, true);
      const subtext = getFormFillSubValue(name, item);

      if (dataType === 'password' && item.url !== hostname) {
        return null;
      }

      if (
        text &&
        (name !== 'password' ? text.startsWith(value) : !value.length)
      ) {
        return {
          _id: item._id,
          text,
          subtext,
        };
      }

      return null;
    })
    .filter((r) => r);
};
