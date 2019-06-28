import { IHistoryItem } from './history-item';

export interface IHistorySection {
  label?: string;
  items?: IHistoryItem[];
  date?: Date;
}
