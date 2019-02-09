import { css } from 'styled-components';

import { body2 } from '~/shared/mixins';

export const Style = css`
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
