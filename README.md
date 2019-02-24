<p align="center">
  <img src="static/app-icons/icon.png" width="256">
</p>

<div align="center">
  <h1>Wexond</h1>

[![Discord](https://img.shields.io/discord/307605794680209409.svg?style=flat-square)](https://discord.gg/yAA8DdK)
[![Travis](https://img.shields.io/travis/com/wexond/wexond.svg?style=flat-square)](https://travis-ci.com/wexond/wexond)
[![AppVeyor](https://img.shields.io/appveyor/ci/sentialx/wexond.svg?style=flat-square)](https://ci.appveyor.com/project/sentialx/wexond)

Wexond is an extensible web browser with a totally different user experience, built on top of `Electron`, `TypeScript`, `React` and `styled-components`.

</div>

# Features

- **Built-in ad-block** Browse the web without any ads.
- **Beautiful and minimalistic UI** The tabs and address bar are located in the same toolbar to take less space.
- **Tab groups** Easily group tabs to tab groups and access them very fast.
- **Expanded new tab page** Have all information such as news, weather or currency in only one page!
- **Partial support for Chrome extensions** Install some extensions from Chrome Web Store (see https://github.com/wexond/wexond/issues/110)

<a href="https://www.patreon.com/bePatron?u=12270966">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

### Sponsors
[![Sponsors](https://opencollective.com/wexond/tiers/sponsor.svg?avatarHeight=48)](https://opencollective.com/wexond)

### Backers
[![Backers](https://opencollective.com/wexond/tiers/backer.svg?avatarHeight=48)](https://opencollective.com/wexond)

# Screenshots

![Home page](screenshots/screenshot-1.png)

### Advanced tabs system

![](screenshots/screen1.gif)

### Support for theme-color

![](screenshots/screen2.gif)

### Overlay with everything you need

![](screenshots/screen3.gif)

# [Downloads](https://github.com/wexond/wexond/releases)

All binaries are located in the [Releases page](https://github.com/wexond/wexond/releases).

# [Roadmap](https://github.com/wexond/wexond/projects)

# [Supported Chrome APIs](https://github.com/wexond/wexond/issues/110)

# Contributing

If you have found any bugs or just want to see some new features in Wexond, feel free to open an issue. I'm open to any suggestions and bug reports would be really helpful for me and appreciated very much. Wexond is in heavy development and some bugs may occur. Also, please don't hesitate to open a pull request. This is really important to me and for the further development of this project.

## Running

Before running Wexond, please ensure you have [`Node.js`](https://nodejs.org/en/) installed on your machine. You can use `npm`, although I highly recommend to use `yarn`. In this guide I will use `yarn`.

Firstly, run this command to install all needed dependencies. If you have encountered any problems, please report it. I will try to help as much as I can.
```bash
$ yarn
```

The given command below will run Wexond in the development mode.
```bash
$ yarn dev
```

## Other commands

You can also run other commands, for other tasks like building the app or linting the code, by using the commands described below.

### Usage:

Using `yarn`:
```bash
$ yarn <command>
```

Using `npm`:
```bash
$ npm run <command>
```

#### List of available commands:

| Command            | Description                                 |
| ------------------ | ------------------------------------------- |
| `build-production` | Bundles Wexond's source in production mode. |
| `compile-win32`    | Compiles Wexond binaries for Windows.       |
| `compile-darwin`   | Compiles Wexond binaries for macOS.         |
| `compile-linux`    | Compiles Wexond binaries for Linux.         |
| `electron-rebuild` | Rebuilds all dependencies for `Electron`.   |
| `lint`             | Lints code.                                 |
| `lint-fix`         | Fixes eslint errors if any                  |
| `start`            | Starts Wexond.                              |
| `dev`              | Starts Wexond in the development mode       |

# Documentation

> At this moment there are no docs, however this may change in the future, see #147.

Guides and the API reference are located in [`docs`](docs).
It also contains documents describing how to use the browser, and create themes.

# Authors

[@sentialx](https://github.com/sentialx)
