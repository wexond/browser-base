import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import { shadows, typography } from 'nersent-ui';
import pages from '../../defaults/pages';

export const StyledToolbar = styled.div`
  width: calc(100% - ${pages.navDrawerWidth}px);
  height: ${pages.toolbarHeight}px;
  position: fixed;
  z-index: 5;
  top: 0;
  left: ${pages.navDrawerWidth}px;
  display: flex;
  align-items: center;
  user-select: none;
`;

export const Content = styled.div`
  width: calc(100% - ${pages.navDrawerWidth}px);
  position: absolute;
  height: 100%;
  left: ${pages.navDrawerWidth}px;
  top: 0;
  display: flex;
  align-items: center;
`;

export const Title = styled.div`
  left: 64px;
  font-size: 32px;
  position: absolute;
  opacity: 0.87;
  ${typography.robotoMedium()};
`;

export const Line = styled.div`
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 128px);
  height: 1px;
  background: rgba(0, 0, 0, 0.12);
  position: absolute;
  bottom: 0;
`;
