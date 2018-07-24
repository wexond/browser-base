import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import opacity from '../../defaults/opacity';
import typography from '../../mixins/typography';

export const Root = styled.div`
  width: 128px;
  height: 48px;
  background-color: rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  align-items: center;
`;

export const Selected = styled.div`
  font-size: 14px;

  ${typography.robotoRegular()};
`;
