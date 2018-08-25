const defaultKeyBindings = require('../../static/defaults/key-bindings.json');

export const defaultPaths: { [key: string]: string } = {
  plugins: 'plugins',
  extensions: 'extensions',
  storage: 'storage',
  keyBindings: 'key-bindings.json',
  windowData: 'window-data.json',
  extensionsStorage: 'storage/extensions',
};

export const filesContent: { [key: string]: string } = {
  keyBindings: JSON.stringify(defaultKeyBindings, null, 2),
  windowData: JSON.stringify({}),
};
