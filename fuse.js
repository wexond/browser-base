const {
  FuseBox,
  WebIndexPlugin,
  QuantumPlugin,
  EnvPlugin,
  CopyPlugin,
} = require('fuse-box');
const express = require('express');
const { spawn } = require('child_process');

const production = process.env.NODE_ENV === 'dev' ? false : true;

const getConfig = (target, type) => {
  return {
    homeDir: 'src/',
    cache: !production,
    target,
    output: `build/$name.js`,
    tsConfig: './tsconfig.json',
    plugins: [
      EnvPlugin({ NODE_ENV: production ? 'production' : 'development' }),
      production &&
        QuantumPlugin({
          bakeApiIntoBundle: type,
          target,
          treeshake: true,
          removeExportsInterop: false,
          uglify: true,
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

const getRendererConfig = target => {
  const cfg = Object.assign({}, getConfig(target, 'renderer'), {
    hash: production,
    sourceMaps: !production,
  });

  return cfg;
};

const getWebIndexPlugin = name => {
  return WebIndexPlugin({
    template: `static/pages/${name}.html`,
    path: '/',
    target: `${name}.html`,
    bundles: [name],
  });
};

const mainProcess = () => {
  const fuse = FuseBox.init(getConfig('server', 'main'));

  const app = fuse.bundle('main').instructions('> [main/index.ts]');

  if (!production) {
    app.watch();

    return fuse.run().then(() => {
      const child = spawn('npm', ['start'], {
        shell: true,
        stdio: 'inherit',
      });
    });
  }

  fuse.run();
};

const renderer = () => {
  const cfg = getRendererConfig('electron');

  cfg.plugins.push(getWebIndexPlugin('app'));
  cfg.plugins.push(CopyPlugin({ files: ['*.woff2', '*.png', '*.svg'] }));

  const fuse = FuseBox.init(cfg);

  if (!production) {
    // Configure development server
    fuse.dev({ root: false }, server => {
      const app = server.httpServer.app;

      app.use(express.static('build'));
    });
  }

  const app = fuse.bundle('app').instructions('> [renderer/app/index.tsx]');

  if (!production) {
    app.hmr().watch();
  }

  fuse.run();
};

const applets = () => {
  const cfg = getRendererConfig('browser@es6');

  cfg.plugins.push(getWebIndexPlugin('history'));
  cfg.plugins.push(getWebIndexPlugin('about'));
  cfg.plugins.push(getWebIndexPlugin('newtab'));
  cfg.plugins.push(getWebIndexPlugin('bookmarks'));
  cfg.plugins.push(CopyPlugin({ files: ['*.woff2', '*.png', '*.svg'] }));

  const fuse = FuseBox.init(cfg);

  if (!production) {
    // Configure development server
    fuse.dev({ root: false, port: 8080 }, server => {
      const app = server.httpServer.app;

      app.use(express.static('build'));
    });
  }

  const about = fuse
    .bundle('about')
    .instructions('> [renderer/about/index.tsx]');

  const history = fuse
    .bundle('history')
    .instructions('> [renderer/history/index.tsx]');

  const bookmarks = fuse
    .bundle('bookmarks')
    .instructions('> [renderer/bookmarks/index.tsx]');

  const newtab = fuse
    .bundle('newtab')
    .instructions('> [renderer/newtab/index.tsx]');

  if (!production) {
    about.hmr().watch();
    history.hmr().watch();
    bookmarks.hmr().watch();
    newtab.hmr().watch();
  }

  fuse.run();
};

const preloads = () => {
  const fuse = FuseBox.init(getRendererConfig());

  const webviewPreload = fuse
    .bundle('webview-preload')
    .instructions('> [preloads/webview-preload.ts]');

  const backgroundPagePreload = fuse
    .bundle('background-page-preload')
    .instructions('> [preloads/background-page-preload.ts]');

  if (!production) {
    webviewPreload.watch();
    backgroundPagePreload.watch();
  }

  fuse.run();
};

renderer();
preloads();
applets();
mainProcess();
