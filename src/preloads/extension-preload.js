const { ipcRenderer, remote } = require('electron');
const { parse } = require('url');

const getAPI = require('./api');

process.once('loaded', () => {
  const extensions = remote.getGlobal('extensions');
  const extensionId = parse(global.location.href).hostname;

  const api = getAPI(extensions.find(x => x.extensionId === extensionId));
  global.wexond = api;
  global.chrome = api;
  global.browser = api;
});
