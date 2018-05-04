import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import { shadows, typography } from 'nersent-ui';

export const StyledToolbar = styled.div`
  width: 100%;
  height: 56px;
  background: linear-gradient(to right, #9575cd, #64b5f6);
  position: absolute;
  top: 0;
  color: #fff;
  display: flex;
  align-items: center;
  user-select: none;
  box-shadow: ${shadows[2]};
  z-index: 10;
`;

export const Content = styled.div`
  width: calc(100% - 288px);
  position: absolute;
  height: 100%;
  left: 288px;
  top: 0;
  display: flex;
  align-items: center;
`;

export const Title = styled.div`
  left: 80px;
  font-size: 18px;
  position: absolute;
  ${typography.robotoMedium()};
`;
