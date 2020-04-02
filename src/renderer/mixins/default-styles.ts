import { css, createGlobalStyle } from 'styled-components';

export const baseStyle = css`
  body {
    user-select: none;
    cursor: default;
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
  }
`;

export const UIStyle = createGlobalStyle`
  ${baseStyle};

  body {
    font-family: system-ui, sans-serif;
  }
`;

export const WebUIStyle = createGlobalStyle`
  ${baseStyle};
`;
