import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import { transparency } from 'nersent-ui';

export const StyledNavigationDrawer = styled.div`
  width: 287px;
  height: calc(100% - 56px);
  position: absolute;
  left: 0;
  top: 56px;
  background-color: #fff;
  border-right: 1px solid rgba(0, 0, 0, ${transparency.light.dividers});
`;
