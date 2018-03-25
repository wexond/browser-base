import { NodeVM } from 'vm2';
import path from 'path';
import fs from 'fs';

// Utils
import { getPath } from '../utils/paths';

interface IPackage {
  name: string;
  version: string;
  description: string;
  main: string;
}

export default class Plugin {
  public package: IPackage;
  public path: string;

  private mainCode: string;

  constructor(name: string) {
    this.path = path.resolve(getPath('plugins'), name);

    const packageContent = fs.readFileSync(this.getPath('package.json'), 'utf8');

    this.package = JSON.parse(packageContent) as IPackage;

    const mainPath = this.getPath(this.package.main);
    this.mainCode = fs.readFileSync(mainPath, 'utf8');
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

    return vm.run(this.mainCode, this.getPath(this.package.main));
  }

  public getPath(relativePath: string) {
    return path.resolve(this.path, relativePath).replace(/\\/g, '/');
  }
}
