const defaultKeyBindings = require('../../static/defaults/key-bindings.json');

export const defaultPaths: { [key: string]: string } = {
  plugins: 'plugins',
  extensions: 'extensions',
  keyBindings: 'key-bindings.json',
};

export const filesContent: { [key: string]: string } = {
  keyBindings: JSON.stringify(defaultKeyBindings, null, 2),
};
