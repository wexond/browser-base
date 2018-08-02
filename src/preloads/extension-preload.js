const injectAPI = require('./api');

const api = injectAPI();
global.wexond = api;
global.chrome = api;
