import styled, { css } from 'styled-components';

import { shadows } from '@mixins';

export const Container = styled.div`
  width: 300px;
  padding-top: 4px;
  padding-bottom: 4px;
  position: absolute;
  top: 56px;
  right: 0;
  background-color: #fff;
  z-index: 9999;
  border-radius: 4px;
  transform-origin: top right;
  -webkit-app-region: no-drag;
  box-sizing: border-box;
  box-shadow: ${shadows(6)};
`;
