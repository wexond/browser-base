<p align="center">
  <a href="https://wexond.net"><img src="static/app-icons/icon.png" width="256"></a>
</p>

<div align="center">
  <h1>Wexond</h1>

[![Travis](https://img.shields.io/travis/com/wexond/wexond.svg?style=for-the-badge)](https://travis-ci.com/wexond/wexond)
[![AppVeyor](https://img.shields.io/appveyor/ci/sentialx/wexond.svg?style=for-the-badge)](https://ci.appveyor.com/project/sentialx/wexond)
[![Discord](https://img.shields.io/discord/307605794680209409.svg?style=for-the-badge)](https://discord.gg/yAA8DdK)
[![Downloads](https://img.shields.io/github/downloads/wexond/wexond/total.svg?style=for-the-badge)](https://github.com/wexond/wexond/releases)

https://wexond.net

Wexond is an extensible and privacy-focused web browser with a totally different user experience, built on top of `Electron`, `TypeScript`, `React` and `styled-components`. It aims to be fast, beautiful, extensible and functional.

</div>

# Features

- **Built-in ad-block** - Browse the web without any ads.
- **Beautiful and minimalistic UI** - The address bar is hidden in Overlay to take less space, but doesn't impact on usability.
- **Tab groups** - Easily group tabs to groups and access them really fast.
- **Partial support for Chrome extensions** - Install some extensions from Chrome Web Store (see [#110](https://github.com/wexond/wexond/issues/110))
- **Overlay** - It contains everything you will need. Search box, bookmarks, menu, your custom components and so on!
- **Packages** - Extend Wexond for you needs, by installing or developing your own packages. Packages can add custom components to the Overlay and also theme the browser!

### Sponsors

[![Sponsors](https://opencollective.com/wexond/tiers/sponsor.svg?avatarHeight=48)](https://opencollective.com/wexond)

### Backers

[![Backers](https://opencollective.com/wexond/tiers/backer.svg?avatarHeight=48)](https://opencollective.com/wexond)

<a href="https://digital-presence.agency/"><img src="https://i.imgur.com/iNY6XA4.jpg" width="256"></a>

# Screenshots

![](https://wexond.net/img/screen.png)

# [Roadmap](https://github.com/wexond/wexond/projects)

# [Supported Chrome APIs](https://github.com/wexond/wexond/issues/110)

# Contributing

If you have found any bugs or just want to see some new features in Wexond, feel free to open an issue. I'm open to any suggestions and bug reports would be really helpful for me and appreciated very much. Wexond is in heavy development and some bugs may occur. Also, please don't hesitate to open a pull request. This is really important to me and for the further development of this project.

## Running

Before running Wexond, please ensure you have [`Node.js`](https://nodejs.org/en/) installed on your machine.

Firstly, run this command to install all needed dependencies. If you have encountered any problems, please report it. I will try to help as much as I can.

```bash
$ npm install
```

The given command below will run Wexond in the development mode.

```bash
$ npm run dev
```

## Other commands

You can also run other commands, for other tasks like building the app or linting the code, by using the commands described below.

### Usage:

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

<a href="https://www.patreon.com/bePatron?u=12270966">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>
