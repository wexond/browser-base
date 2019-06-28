const {
  FuseBox,
  WebIndexPlugin,
  QuantumPlugin,
  EnvPlugin,
  CopyPlugin,
  JSONPlugin,
  StyledComponentsPlugin,
} = require('fuse-box');

const { spawn } = require('child_process');

const production = process.env.NODE_ENV === 'dev' ? false : true;

const getConfig = target => {
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
          bakeApiIntoBundle: true,
          treeshake: true,
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

const getWebIndexPlugin = name => {
  return WebIndexPlugin({
    template: `static/pages/app.html`,
    path: production ? '.' : '/',
    target: `${name}.html`,
    bundles: [name],
  });
};

const renderer = name => {
  const cfg = getRendererConfig('electron');

  cfg.plugins.push(getWebIndexPlugin(name));

  cfg.plugins.push(JSONPlugin());
  cfg.plugins.push(getCopyPlugin());
  cfg.plugins.push(StyledComponentsPlugin());

  const fuse = FuseBox.init(cfg);

  const app = fuse
    .bundle(name)
    .instructions(`> [renderer/views/${name}/index.tsx]`);

  if (!production) {
    if (name === 'app') {
      fuse.dev({ httpServer: true });

      app.hmr().watch();

      fuse.run().then(() => {
        spawn('npm', ['start'], {
          shell: true,
          stdio: 'inherit',
        });
      });
    } else {
      app.watch();
    }
  } else {
    fuse.run();
  }
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

renderer('app');
renderer('auth');
renderer('permissions');
renderer('find');
preload('view-preload');
main();
