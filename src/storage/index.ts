import DbService from './services/db';

(async () => {
  await DbService.start();
})();
