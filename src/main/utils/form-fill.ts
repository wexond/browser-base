import storage from '../services/storage';
import { IFormFillData, IFormFillItem } from '~/interfaces';
import { getFormFillValue, getFormFillSubValue } from '~/utils/form-fill';

const getType = (name: string) => {
  return (name === 'username' || name === 'login' || name === 'password') ? 'password' : 'address';
}

export const getFormFillMenuItems = async (name: string, value: string) => {
  const items = await storage.find<IFormFillData>({
    scope: 'formfill',
    query: {
      type: getType(name),
    },
  });

  return items.map(item => {
    const text = getFormFillValue(name, item, true);
    const subtext = getFormFillSubValue(name, item);

    if (text && (name !== 'password' ? text.startsWith(value) : !value.length)) {
      return {
        _id: item._id,
        text,
        subtext,
      } as IFormFillItem;
    }

    return null;
  }).filter(r => r);
}
