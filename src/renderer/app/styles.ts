import { css } from 'styled-components';
import { fonts } from '~/renderer/defaults';
import { body2 } from '@mixins';

export const Style = css`
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: url(${fonts.robotoRegular}) format('truetype');
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    src: url(${fonts.robotoMedium}) format('truetype');
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: url(${fonts.robotoLight}) format('truetype');
  }

  body {
    user-select: none;
    cursor: default;
    ${body2()} margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
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
