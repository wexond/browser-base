import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import { shadows, typography } from 'nersent-ui';

export const StyledToolbar = styled.div`
  width: 100%;
  height: 64px;
  background: linear-gradient(to right, #9575cd, #64b5f6);
  position: absolute;
  top: 0;
  color: #fff;
  display: flex;
  align-items: center;
  user-select: none;
  box-shadow: ${shadows[2]};
`;

export const Title = styled.div`
  margin-left: 24px;
  font-size: 18px;
  ${typography.robotoMedium()};
`;
