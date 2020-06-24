import DbService from './db';
import { HistoryServiceBase } from '~/common/services/history';
import { WorkerMessengerFactory } from '~/common/worker-messenger-factory';
import { IHistoryPrivateChunkDetails } from '~/interfaces/history_private';

class HistoryPrivateService extends HistoryServiceBase {
  public start() {
    const handler = WorkerMessengerFactory.createHandler(
      'history_private',
      this,
    );

    handler('getChunk', this.getChunk);
  }

  private get db() {
    return DbService.history;
  }

  public getChunk(details: IHistoryPrivateChunkDetails) {
    return [];
  }
}

export default new HistoryPrivateService();
