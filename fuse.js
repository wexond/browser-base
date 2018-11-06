const {
  FuseBox,
  WebIndexPlugin,
  QuantumPlugin,
  EnvPlugin,
  CopyPlugin,
  JSONPlugin,
} = require('fuse-box');
const { spawn } = require('child_process');

const production = process.env.NODE_ENV === 'dev' ? false : true;

const getConfig = () => {
  return {
    homeDir: 'src/',
    cache: !production,
    output: `build/$name.js`,
    tsConfig: './tsconfig.json',
    useTypescriptCompiler: true,
    plugins: [
      EnvPlugin({ NODE_ENV: production ? 'production' : 'development' }),
      production &&
        QuantumPlugin({
          bakeApiIntoBundle: true,
          treeshake: true,
          uglify: {
            es6: true,
          },
        }),
    ],
    alias: {
      '@': '~/shared/',
      '@app': '~/renderer/app/',
      '@history': '~/renderer/history/',
      '@bookmarks': '~/renderer/bookmarks/',
      '@about': '~/renderer/about/',
      '@newtab': '~/renderer/newtab/',
      '~': '~/',
    },
  };
};

const getRendererConfig = () => {
  const cfg = Object.assign({}, getConfig(), {
    sourceMaps: true,
  });

  return cfg;
};

const getWebIndexPlugin = name => {
  return WebIndexPlugin({
    template: `static/pages/${name}.html`,
    path: production ? '.' : '/',
    target: `${name}.html`,
    bundles: [name],
    defer: true,
  });
};

const getCopyPlugin = () => {
  return CopyPlugin({
    files: ['*.woff2', '*.png', '*.svg'],
    dest: 'assets',
    resolve: production ? './assets' : '/assets',
  });
};

const mainProcess = () => {
  const fuse = FuseBox.init(getConfig('server'));

  const app = fuse.bundle('main').instructions(`> [main/index.ts]`);

  if (!production) {
    app.watch();
  }

  fuse.run();
};

const renderer = () => {
  const cfg = getRendererConfig();

  cfg.plugins.push(getWebIndexPlugin('app'));
  cfg.plugins.push(JSONPlugin());
  cfg.plugins.push(getCopyPlugin());

  const fuse = FuseBox.init(cfg);

  if (!production) {
    fuse.dev({ httpServer: true });
  }

  const app = fuse
    .bundle('app')
    .target('electron')
    .instructions('> [renderer/app/index.tsx]');

  if (!production) {
    app.hmr().watch();

    return fuse.run().then(() => {
      const child = spawn('npm', ['start'], {
        shell: true,
        stdio: 'inherit',
      });
    });
  }

  fuse.run();
};

const applet = () => {
  const cfg = getRendererConfig();

  cfg.plugins.push(getWebIndexPlugin('newtab'));
  cfg.plugins.push(JSONPlugin());
  cfg.plugins.push(getCopyPlugin());

  const fuse = FuseBox.init(cfg);

  if (!production) {
    fuse.dev({
      httpServer: true,
      port: 8080,
      socketURI: 'ws://localhost:8080',
    });
  }

  const newtab = fuse
    .bundle('newtab')
    .target('browser@es6')
    .instructions('> renderer/newtab/index.tsx');

  if (!production) {
    newtab.hmr().watch();
  }

  fuse.run();
};

const preload = name => {
  const fuse = FuseBox.init(getRendererConfig());

  const bundle = fuse
    .bundle(name)
    .target('electron')
    .instructions(`> [preloads/${name}.ts]`);

  if (!production) {
    bundle.watch();
    return;
  }

  fuse.run();
};

renderer();
preload('webview-preload');
preload('background-page-preload');
mainProcess();
applet();
