import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import opacity from '../../../defaults/opacity';
import typography from '../../../mixins/typography';

export const Root = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 8px;
  font-size: 14px;
  color: rgba(0, 0, 0, ${opacity.light.primaryText});

  ${typography.robotoRegular()};
`;
