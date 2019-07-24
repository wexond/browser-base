import storage from '../services/storage';
import { IFormFillData, IFormFillItem } from '~/interfaces';
import { getFormFillValue, getFormFillSubValue } from '~/utils/form-fill';

export const getFormFillMenuItems = async (name: string) => {
  const items = await storage.find<IFormFillData>({
    scope: 'formfill',
    query: {},
  });

  return items.map(item => {
    const text = getFormFillValue(name, item);
    const subtext = getFormFillSubValue(name, item);

    return text && {
      _id: item._id,
      text,
      subtext,
    } as IFormFillItem;
  }).filter(r => r);
}
