<p align="center">
  <img src="static/app-icons/icon.png" width="256">
</p>

<div align="center">
  <h1>Flowr PC Client</h1>

Flowr PC Client is an Flowr client for PC, Mac or Linux. Thers is an embedded privacy-focused web browser with a totally different user experience, built on top of `Electron`, `TypeScript`, `React` and `styled-components`. It aims to be fast, private, beautiful, extensible and functional.

</div>

# Features

- Flowr
- [Wexond](https://github.com/wexond/wexond)  **2.1.0** A privacy-focused, extensible and beautiful web browser

## Running

Before running flowr-desktop, please ensure you have [`Node.js`](https://nodejs.org/en/) installed on your machine.

When running on Windows, make sure you have build tools installed. You can install them by running as **administrator**:

```bash
$ npm i -g windows-build-tools
```

Firstly, run this command to install all needed dependencies. If you have encountered any problems, please report it. I will try to help as much as I can.

```bash
$ npm install
```

The given command below will run flowr-desktop in the development mode.

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

| Command          | Description                                 |
| ---------------- | ------------------------------------------- |
| `build`          | Bundles flowr-desktop's source in production mode. |
| `compile-win32`  | Compiles flowr-desktop binaries for Windows.       |
| `compile-darwin` | Compiles flowr-desktop binaries for macOS.         |
| `compile-linux`  | Compiles flowr-desktop binaries for Linux.         |
| `lint`           | Lints code.                                          |
| `lint-fix`       | Fixes eslint errors if any                           |
| `start`          | Starts flowr-desktop.                              |
| `dev`            | Starts flowr-desktop in the development mode       |


#### Translation

The browser is available in English (default) and French. 
Translation are located in `src/wexdond/local`.
We used [i18n-manager](https://github.com/gilmarsquinelato/i18n-manager) to edit local directory.
