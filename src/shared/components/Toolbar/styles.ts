import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import { shadows, typography } from 'nersent-ui';
import pages from '../../defaults/pages';

export const StyledToolbar = styled.div`
  width: 100%;
  height: ${pages.toolbarHeight}px;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  user-select: none;
  background: linear-gradient(to right, #9575cd, #64b5f6);
  z-index: 10;
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
  left: 80px;
  font-size: 18px;
  position: absolute;
  color: #fff;
  ${typography.robotoMedium()};
`;
