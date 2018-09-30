import styled, { css } from 'styled-components';

import { EASE_FUNCTION } from '@/constants/design';
import { transparency } from '@/constants/renderer';
import { shadows } from '@/mixins';
import { TOOLBAR_HEIGHT } from '@/constants/app';

export const Container = styled.div`
  width: 300px;
  padding-top: 8px;
  padding-bottom: 8px;
  position: absolute;
  top: ${TOOLBAR_HEIGHT}px;
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
    margin-top: ${visible ? 0 : -20}px
    transition: 0.2s margin-top, 0.2s opacity;
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
