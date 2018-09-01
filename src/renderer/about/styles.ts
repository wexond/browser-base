import { css } from 'styled-components';

import { body2 } from '@mixins';
import { fonts } from '~/renderer/defaults';

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
    background-color: white;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  a {
    text-decoration: none;
  }
`;
