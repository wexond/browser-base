<h1 align="center"><img src="https://wexond.nersent.tk/logo/wexond.png" width="400"></h1>

[![discord](https://discordapp.com/api/guilds/307605794680209409/widget.png)](https://discord.gg/yAA8DdK)
[![Build Status](https://travis-ci.org/Nersent/wexond.svg)](https://travis-ci.org/Nersent/wexond)
[![dependencies Status](https://david-dm.org/nersent/wexond/status.svg)](https://david-dm.org/nersent/wexond)
[![devDependencies Status](https://david-dm.org/nersent/wexond/dev-status.svg)](https://david-dm.org/nersent/wexond?type=dev)

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# Wexond
`Wexond` is an extensible, fast and innovative web browser written in ES2017 using [`Electron`](https://github.com/electron/electron), [`InfernoJS`](https://github.com/infernojs/inferno) to build browser's UI easier, and [`MobX`](https://github.com/mobxjs/mobx) to easily manage states.

## Documentation
Guides and the API reference are located in [`docs`](https://github.com/Nersent/Wexond/docs).
It also contains documents describing how to use the browser, and create extensions.

## Downloads
[![Downloads](https://img.shields.io/github/downloads/Nersent/Wexond/total.svg)](https://github.com/Nersent/Wexond/releases)

There aren't any precompiled binaries at this moment, so to open `Wexond` you will need to run the application manually, so head over to [Running section](#running).

## Running
**NOTE**: The process shown here uses [`yarn`](https://yarnpkg.com/lang/en/), but those commands can be run with [`npm`](https://www.npmjs.com/). Though we highly recommend you to use [`yarn`](https://yarnpkg.com/lang/en/).

Before using those commands below, please make sure you have [`npm`](https://www.npmjs.com/) and [`yarn`](https://yarnpkg.com/lang/en/) installed.

Before running `Wexond`, you need to install all needed dependencies:
```bash
yarn
```

If you have installed all dependencies successfully, then in first terminal you need to run:
```bash
yarn run watch:app
```
and in second terminal:
```bash
yarn start
```
