import { databases } from '~/defaults/databases';
import { HistoryItem } from '~/interfaces/history-item';

export const getHistory = () => {
  return new Promise((resolve: (items: HistoryItem[]) => void) => {
    databases.history
      .find({})
      .sort({ date: 1 })
      .exec((err: any, items: HistoryItem[]) => {
        if (err) return console.warn(err);

        resolve(items);
      });
  });
};
