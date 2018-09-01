import styled, { css } from 'styled-components';

import { shadows } from '@mixins';
import { EASE_FUNCTION } from '~/constants';

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
  will-change: opacity;
  box-sizing: border-box;
  box-shadow: ${shadows(6)};

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'all' : 'none'};
    transform: ${visible ? 'scale(1)' : 'scale(0)'};
    transition: ${`0.3s ${EASE_FUNCTION} transform, ${
      visible ? 0.1 : 0.2
    }s opacity`};
  `};
`;
