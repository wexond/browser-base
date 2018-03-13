import { ipcRenderer } from "electron";
import React from "react";
import ReactDOM from "react-dom";
import { injectGlobal } from "styled-components";

import { typography } from "nersent-ui";

import App from "./components/App";

import Store from "./store";

injectGlobal`
  body {
    user-select: none;
    cursor: default;
    ${typography.body1()}
    margin: 0;
    padding: 0;
  }
`;

ReactDOM.render(<App />, document.getElementById("app"));

ipcRenderer.on("fullscreen", (isFullscreen: boolean) => {
  Store.isFullscreen = isFullscreen;
});
