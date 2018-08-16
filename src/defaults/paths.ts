import { getPath } from '../utils/paths';

export const defaultPaths = {
  plugins: getPath('plugins'),
  extensions: getPath('extensions'),
  keyBindings: getPath('key-bindings.json'),
};

export default defaultPaths;
