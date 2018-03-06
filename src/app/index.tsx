import React from "react";
import ReactDOM from "react-dom";
import { injectGlobal } from "styled-components";

import typography from "../shared/mixins/typography";

import App from "./components/App";

injectGlobal`
  body {
    user-select: none;
    cursor: default;
    ${typography.body1()}
    margin: 0;
    padding: 0;
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: local('Roboto'), local('Roboto-Regular'), url(../shared/fonts/roboto-regular.woff2) format('woff2');
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    src: local('Roboto Medium'), local('Roboto-Medium'), url(../shared/fonts/roboto-medium.woff2) format('woff2');
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: local('Roboto Light'), local('Roboto-Light'), url(../shared/fonts/roboto-light.woff2) format('woff2');
  }
`;

ReactDOM.render(<App />, document.getElementById("app"));
