import { EventEmitter } from 'events';

import { IHistoryVisitsRemoved } from '~/interfaces/history';

export declare interface HistoryServiceBase {
  on(
    event: 'visitRemoved',
    listener: (removed?: IHistoryVisitsRemoved) => void,
  ): this;
}

export class HistoryServiceBase extends EventEmitter {}
