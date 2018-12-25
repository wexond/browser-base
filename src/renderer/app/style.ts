import { css } from 'styled-components';

import { fonts } from '~/renderer/constants/fonts';
import { body2 } from '~/shared/mixins';

export const Style = css`
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: url(${fonts.robotoRegular}) format('woff2');
  }
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    src: url(${fonts.robotoMedium}) format('woff2');
  }
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: url(${fonts.robotoLight}) format('woff2');
  }

  body {
    user-select: none;
    cursor: default;
    margin: 0;
    background-color: white;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    ${body2()}
  }

  * {
    box-sizing: border-box;
  }
`;
