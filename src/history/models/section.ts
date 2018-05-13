import HistoryItem from '../../shared/models/history-item';

export default interface Section {
  items: HistoryItem[];
  date: string;
  id: number;
} // eslint-disable-line
