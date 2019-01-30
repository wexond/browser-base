const {
  FuseBox,
  WebIndexPlugin,
  QuantumPlugin,
  EnvPlugin,
  JSONPlugin,
  CSSResourcePlugin,
  SassPlugin,
  CSSPlugin,
} = require('fuse-box');
const { spawn } = require('child_process');

const production = process.env.NODE_ENV === 'dev' ? false : true;

const getConfig = (target, name) => {
  return {
    homeDir: 'src/',
    cache: !production,
    target,
    output: `build/$name.js`,
    tsConfig: './tsconfig.json',
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
          css: true,
        }),
    ],
    alias: {
      '~': '~/',
      ui: '~/renderer/utils/create-element',
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
    template: `src/renderer/pages/${name}.html`,
    path: production ? '.' : '/',
    target: `${name}.html`,
    bundles: [name],
  });
};

const mainProcess = () => {
  const fuse = FuseBox.init(getConfig('server', 'main'));

  const app = fuse.bundle('main').instructions(`> [main/index.ts]`);

  if (!production) {
    app.watch();
  }

  fuse.run();
};

const renderer = () => {
  const cfg = getRendererConfig('electron', 'app');

  cfg.plugins.push(getWebIndexPlugin('app'));
  cfg.plugins.push(JSONPlugin());
  cfg.plugins.push([
    SassPlugin(),
    CSSResourcePlugin({ dist: 'build/css-resources', inline: true }),
    CSSPlugin(),
  ]);

  const fuse = FuseBox.init(cfg);

  if (!production) {
    fuse.dev({ httpServer: true });
  }

  const app = fuse
    .bundle('app')
    .instructions('> renderer/app/index.ts -electron');

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

renderer();
mainProcess();
