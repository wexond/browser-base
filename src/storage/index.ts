import DbService from './services/db';
import CommunicationService from './services/communication';

(async () => {
  await DbService.start();
  await CommunicationService.start();
})();
