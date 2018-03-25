import { NodeVM } from 'vm2';
import path from 'path';
import fs from 'fs';

// Utils
import { getPath } from '../utils/paths';

interface IPluginPackage {
  name: string;
  version: string;
  description: string;
  main: string;
}

interface IPluginAPI {
  styleTabBar: () => {};
}

export default class Plugin {
  public api: IPluginAPI;
  public package: IPluginPackage;
  public path: string;

  private mainCode: string;

  constructor(name: string) {
    this.path = path.resolve(getPath('plugins'), name);

    const pluginPackageContent = fs.readFileSync(this.getPath('package.json'), 'utf8');

    this.package = JSON.parse(pluginPackageContent) as IPluginPackage;

    const pluginMainPath = this.getPath(this.package.main);
    this.mainCode = fs.readFileSync(pluginMainPath, 'utf8');
    this.api = this.run();
  }

  public run() {
    const vm = new NodeVM({
      console: 'inherit',
      sandbox: {},
      require: {
        external: true,
        builtin: ['*'],
        root: './',
        mock: {
          fs: {},
        },
      },
    });

    return vm.run(this.mainCode, this.getPath(this.package.main)) as IPluginAPI;
  }

  public getPath(relativePath: string) {
    return path.resolve(this.path, relativePath).replace(/\\/g, '/');
  }
}
