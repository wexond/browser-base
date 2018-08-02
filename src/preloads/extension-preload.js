const getAPI = require('./api');

const api = getAPI();
global.wexond = api;
global.chrome = api;
