import styled, { css } from 'styled-components';

import { EASE_FUNCTION } from '@/constants/app';
import { transparency } from '@/constants/renderer';
import { shadows } from '@/mixins';

export const Container = styled.div`
  width: 300px;
  padding-top: 8px;
  padding-bottom: 8px;
  position: absolute;
  top: 44px;
  right: 0;
  background-color: #fff;
  z-index: 9999;
  border-radius: 4px;
  transform-origin: top right;
  -webkit-app-region: no-drag;
  will-change: opacity;
  box-sizing: border-box;
  box-shadow: ${shadows(8)};

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'all' : 'none'};
    transform: ${visible ? 'scale(1)' : 'scale(0)'};
    transition: ${`0.3s ${EASE_FUNCTION} transform, ${
      visible ? 0.1 : 0.2
    }s opacity`};
  `};
`;

export const Separator = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
  background-color: rgba(0, 0, 0, ${transparency.light.dividers});
  height: 1px;
  width: 100%;
  transition: 0.2s opacity;

  display: ${({ visible }: { visible: boolean }) =>
    visible ? 'block' : 'none'};
`;
