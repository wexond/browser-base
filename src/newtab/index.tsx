import React from 'react';
import { AppContainer } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import App from './components/App';
import typography from '../shared/mixins/typography';

const robotoLight = require('../shared/fonts/Roboto-Light.ttf');
const robotoMedium = require('../shared/fonts/Roboto-Medium.ttf');
const robotoRegular = require('../shared/fonts/Roboto-Regular.ttf');

declare const module: any;

injectGlobal`
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: url(${robotoLight}) format('truetype');
  }
  
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: url(${robotoRegular}) format('truetype');
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    src: url(${robotoMedium}) format('truetype');
  }
  
  body {
    user-select: none;
    cursor: default;
    ${typography.body1()}
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }

  a {
    text-decoration: none;
    color: unset;
  }

  @keyframes nersent-ui-preloader-rotate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes nersent-ui-preloader-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }
`;

function render(Component: any) {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app'),
  );
}

async function setup() {
  render(App);
}

setup();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    // eslint-disable-next-line
    const NextApp = require('./components/App').default;
    render(NextApp);
  });
}
