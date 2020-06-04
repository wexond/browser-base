/* eslint-disable */
const { getConfig, dev } = require('./webpack.config.base');
const { spawn, execSync } = require('child_process');
const { writeFileSync, readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const stripJsonComments = require('strip-json-comments');
const idlToJson = require('./tools/idl_to_json');
const jsonAPICompiler = require('./tools/json_schema_compiler');

let terser = require('terser');
/* eslint-enable */

let electronProcess;

const mainConfig = getConfig({
  target: 'electron-main',

  devtool: dev ? 'inline-source-map' : 'none',

  watch: dev,

  entry: {
    browser: './src/browser',
  },

  plugins: [
    // new BundleAnalyzerPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from:
            'node_modules/@cliqz/adblocker-electron-preload/dist/preload.cjs.js',
          to: 'preload.js',
          transform: (fileContent, path) => {
            return terser.minify(fileContent.toString()).code.toString();
          },
        },
      ],
    }),
  ],
});

const storageConfig = getConfig({
  target: 'node',

  devtool: dev ? 'inline-source-map' : 'none',

  watch: dev,

  entry: {
    storage: './src/storage',
  },

  plugins: [
    new CopyPlugin({
      patterns: [{ from: './static/storage/schema.sql', to: 'storage' }],
    }),
  ],
});

// TODO: sandbox
const preloadConfig = getConfig({
  target: 'electron-renderer',

  devtool: 'none',

  watch: dev,

  entry: {
    'api-preload': './src/renderer/preloads/api',
    //'view-preload': './src/preloads/view-preload',
  },

  plugins: [],
});

if (process.env.ENABLE_EXTENSIONS) {
  preloadConfig.entry['popup-preload'] = './src/preloads/popup-preload';
}

if (process.env.START === '1') {
  mainConfig.plugins.push({
    apply: (compiler) => {
      compiler.hooks.beforeCompile.tap('BeforeRunPlugin', () => {
        const jsons = [];
        const path = join(__dirname, 'src/common/extensions/api');
        readdirSync(path).forEach((file) => {
          if (file.startsWith('_')) return;
          if (!file.endsWith('.json') && !file.endsWith('.idl')) return;

          const content = readFileSync(join(path, file), 'utf8');

          if (file.endsWith('.json')) {
            jsons.push(JSON.parse(stripJsonComments(content)));
          } else if (file.endsWith('.idl')) {
            jsons.push(idlToJson(join(path, file), 'aha'));
          }
        });

        const output = jsonAPICompiler(jsons, join(path, '_api_features.json'));
        writeFileSync(
          join(__dirname, 'src/renderer/extensions/api/_generated_api.js'),
          output,
        );
      });

      compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
        if (electronProcess) {
          try {
            if (process.platform === 'win32') {
              execSync(`taskkill /pid ${electronProcess.pid} /f /t`);
            } else {
              electronProcess.kill();
            }

            electronProcess = null;
          } catch (e) {}
        }

        electronProcess = spawn('npm', ['start'], {
          shell: true,
          env: process.env,
          stdio: 'inherit',
        });
      });
    },
  });
}

module.exports = [mainConfig, storageConfig, preloadConfig];
