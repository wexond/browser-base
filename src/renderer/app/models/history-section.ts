import { HistoryItem } from './history-item';

export interface HistorySection {
  label?: string;
  items?: HistoryItem[];
  date?: Date;
}
