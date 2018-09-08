import { HistoryItem } from '@/interfaces';

export interface HistorySection {
  id?: string;
  title?: string;
  items?: HistoryItem[];
}
