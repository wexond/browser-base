import { fusebox, sparky } from 'fuse-box';
const externals = [
  'extract-file-icon',
  'mouse-hooks',
  'node-window-manager',
  'node-vibrant',
  'leveldown',
  'electron-extensions',
  'keytar',
  'console',
  '@cliqz/adblocker-electron',
];
class Context {
  isProduction;
  runServer;
  getMainConfig() {
    return fusebox({
      output: 'dist/main/$name-$hash',
      target: 'electron',
      homeDir: '',
      entry: 'src/main/index.ts',
      useSingleBundle: true,
      env: { NODE_ENV: process.env.NODE_ENV },
      tsConfig: 'tsconfig.json',
      watch: { ignored: ['src/renderer'] },
      dependencies: { ignoreAllExternal: true },
      logging: { level: 'succinct' },
      cache: {
        enabled: false,
        root: '.cache/main',
      },
    });
  }
  launch(handler) {
    handler.onComplete(output => {
      output.electron.handleMainProcess();
    });
  }
  getRendererConfig() {
    return fusebox({
      output: 'dist/renderer/$name-$hash',
      target: 'electron',
      tsConfig: 'tsconfig.json',
      env: { NODE_ENV: process.env.NODE_ENV },
      entry: 'src/renderer/views/app/index.tsx',
      dependencies: { include: ['tslib'], ignorePackages: externals },

      webIndex: {
        publicPath: './',
        template: 'src/renderer/views/app/index.html',
      },
      watch: { ignored: ['src/main'] },
      cache: {
        enabled: false,
        root: '.cache/renderere',
      },
      devServer: true,
    });
  }
}
const { task, rm } = sparky<Context>(Context);

task('default', async ctx => {
  process.env.NODE_ENV = 'development';

  const rendererConfig = ctx.getRendererConfig();
  await rendererConfig.runDev();

  const electronMain = ctx.getMainConfig();
  await electronMain.runDev(handler => ctx.launch(handler));
});

task('dist', async ctx => {
  await rm('./dist');
  process.env.NODE_ENV = 'production';

  const rendererConfig = ctx.getRendererConfig();
  await rendererConfig.runProd({ uglify: false });

  const electronMain = ctx.getMainConfig();
  await electronMain.runProd({
    uglify: true,
    manifest: true,
    handler: handler => ctx.launch(handler),
  });
});
