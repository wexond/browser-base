const {
  FuseBox,
  WebIndexPlugin,
  QuantumPlugin,
  EnvPlugin,
  CopyPlugin,
  JSONPlugin,
  StyledComponentsPlugin,
  SassPlugin,
  CSSPlugin,
  CSSResourcePlugin,
} = require('fuse-box');

const { spawn } = require('child_process');

const production = process.env.NODE_ENV === 'dev' ? false : true;

const getConfig = (target, name) => {
  return {
    homeDir: 'src/',
    cache: !production,
    target,
    output: `build/$name.js`,
    useTypescriptCompiler: true,
    plugins: [
      EnvPlugin({ NODE_ENV: production ? 'production' : 'development' }),
      production &&
        QuantumPlugin({
          bakeApiIntoBundle: name,
          treeshake: true,
          removeExportsInterop: false,
          uglify: {
            es6: true,
          },
        }),
    ],
    alias: {
      '~': '~/',
    },
    log: {
      showBundledFiles: false,
    },
  };
};

const getRendererConfig = (target, name) => {
  const cfg = Object.assign({}, getConfig(target, name), {
    sourceMaps: !production,
  });

  return cfg;
};

const getWebIndexPlugin = name => {
  return WebIndexPlugin({
    template: `static/pages/${name}.html`,
    path: production || name !== 'app' ? '.' : '/',
    target: `${name}.html`,
    bundles: [name],
  });
};

const getCopyPlugin = () => {
  return CopyPlugin({
    files: ['*.woff2', '*.png', '*.svg'],
    dest: 'assets',
    resolve: production ? './assets' : '/assets',
  });
};

const main = () => {
  const fuse = FuseBox.init(getConfig('server', 'main'));

  const app = fuse.bundle('main').instructions(`> [main/index.ts]`);

  if (!production) {
    app.watch();
  }

  fuse.run();
};

const renderer = (name, port) => {
  const cfg = getRendererConfig('electron', name);

  cfg.plugins.push(getWebIndexPlugin(name));
  cfg.plugins.push(JSONPlugin());
  cfg.plugins.push(getCopyPlugin());
  cfg.plugins.push(StyledComponentsPlugin());

  const fuse = FuseBox.init(cfg);

  if (!production) {
    fuse.dev({ httpServer: true, port, socketURI: `ws://localhost:${port}` });
  }

  const app = fuse.bundle(name).instructions(`> [renderer/${name}/index.tsx]`);

  if (!production) {
    if (name === 'app') {
      app.hmr({ port, socketURI: `ws://localhost:${port}` }).watch();

      return fuse.run().then(() => {
        const child = spawn('npm', ['start'], {
          shell: true,
          stdio: 'inherit',
        });
      });
    } else {
      app.watch();
    }
  }

  fuse.run();
};

const dialog = name => {
  const cfg = getRendererConfig('electron', name);

  cfg.plugins.push(getWebIndexPlugin(name));
  cfg.plugins.push(JSONPlugin());
  cfg.plugins.push([
    SassPlugin(),
    CSSResourcePlugin({ dist: 'build/css-resources' }),
    CSSPlugin(),
  ]);

  const fuse = FuseBox.init(cfg);
  const app = fuse
    .bundle(name)
    .instructions(`> [renderer/${name}/index.ts] + fuse-box-css`);

  if (!production) {
    app.watch();
  }

  fuse.run();
};

const preload = name => {
  const cfg = getRendererConfig('electron', name);

  const fuse = FuseBox.init(cfg);

  const app = fuse.bundle(name).instructions(`> [preloads/${name}.ts]`);

  if (!production) {
    app.watch();
  }

  fuse.run();
};

renderer('app', 4444);
dialog('permissions');
preload('view-preload');
main();
