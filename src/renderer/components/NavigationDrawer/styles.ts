import styled from 'styled-components';

import { transparency } from '~/renderer/defaults';
import { shadows } from '@mixins';

export const Root = styled.div`
  height: 100%;
  width: 256px;
  background-color: #fff;
  position: fixed;
  flex-flow: column;
  display: flex;
  top: 0;
  left: 0;
  z-index: 9999;
  box-sizing: border-box;
  border-right: 1px solid rgba(0, 0, 0, ${transparency.light.dividers});
  will-change: transform, transition;
  transition: 0.4s transform cubic-bezier(0.19, 1, 0.22, 1);

  box-shadow: ${shadows(16)};
`;
