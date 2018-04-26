import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import { shadows, typography } from 'nersent-ui';

export const StyledToolbar = styled.div`
  width: 100%;
  height: 64px;
  background: linear-gradient(to right, #8e7ed3, #6aadf1);
  position: fixed;
  top: 0;
  z-index: 9;
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
