const {
  FuseBox,
  WebIndexPlugin,
  QuantumPlugin,
  EnvPlugin,
  CopyPlugin,
  JSONPlugin,
  StyledComponentsPlugin,
  CSSResourcePlugin,
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
      '~': '~/wexond',
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
    path: production ? '.' : '/',
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

  const app = fuse.bundle('main').instructions('> [launcher/index.ts]');

  if (!production) {
    app.watch();
  }

  fuse.run();
};

const renderer = (name, port) => {
  const cfg = getRendererConfig('electron', name);

  cfg.plugins.push(getWebIndexPlugin(name));
  cfg.plugins.push(getWebIndexPlugin('config'));
  cfg.plugins.push(JSONPlugin());
  cfg.plugins.push(getCopyPlugin());
  cfg.plugins.push(StyledComponentsPlugin());

  const fuse = FuseBox.init(cfg);

  if (!production) {
    fuse.dev({ httpServer: true, port, socketURI: `ws://localhost:${port}` });
  }

  const app = fuse.bundle(name).instructions(`> [wexond/renderer/${name}/index.tsx]`);

  if (!production) {
    app.hmr({ port, socketURI: `ws://localhost:${port}` }).watch();

    if (name === 'app') {
      return fuse.run().then(() => {
        const child = spawn('npm', ['start'], {
          shell: true,
          stdio: 'inherit',
        });
      });
    }
  }

  fuse.run();
};

const preload = name => {
  const cfg = getRendererConfig('electron', name);

  const fuse = FuseBox.init(cfg);

  const app = fuse.bundle(name).instructions(`> [preloads/${name}.ts] + fuse-box-css`);

  if (!production) {
    app.watch();
  }

  fuse.run();
};

const bundlePhoneApp = () => {
  const cfg = getRendererConfig('electron', 'phone')
  cfg.plugins.push(getWebIndexPlugin('phone'))
  cfg.plugins.push(JSONPlugin())
  cfg.plugins.push(getCopyPlugin())
  cfg.plugins.push(CSSPlugin())
  cfg.plugins.push(CSSResourcePlugin({ dist: "dist/css-resources" }))

  const fuse = FuseBox.init(cfg)
  const app = fuse.bundle('phone').instructions('> [phone/views/index.tsx] + fuse-box-css')

  if (!production) {
    const port = 4445
    fuse.dev({ httpServer: false, port, socketURI: `ws://localhost:${port}` })
    app.hmr({ port, socketURI: `ws://localhost:${port}`, reload: true }).watch()
  }

  fuse.run()
}

const phonePreload = () => {
  const cfg = {
    sourceMaps: !production,
    homeDir: 'src/',
    cache: !production,
    target: 'electron',
    output: 'build/phonePreload.js',
    useTypescriptCompiler: true,
    plugins: [
      production &&
        QuantumPlugin({
          bakeApiIntoBundle: 'phonePreload',
          treeshake: true,
          removeExportsInterop: false,
          uglify: {
            es6: true,
          },
        }),
    ],
    log: {
      showBundledFiles: false,
    }
  }
  const fuse = FuseBox.init(cfg)
  fuse.bundle('phonePreload').instructions('> [phone/preloads/phonePreload.ts]')
  fuse.run()
}

const exportNode = () => {
  const scriptName = 'exportNode'
  const cfg = getRendererConfig('electron', scriptName)
  const fuse = FuseBox.init(cfg)
  fuse.bundle(scriptName).instructions(`> [frontend/preloads/${scriptName}.ts]`)
  fuse.run()
}

renderer('app', 4444)
bundlePhoneApp()
phonePreload()
preload('view-preload')
preload('background-preload')
exportNode()

main()
