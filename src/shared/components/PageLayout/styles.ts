import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

export const StyledPageLayout = styled.div`
  width: 100%;
  height: 100%;
`;

export const Container = styled.div`
  width: calc(100% - 288px);
  height: calc(100% - 64px);
  overflow: auto;
  position: absolute;
  right: 0;
  top: 0;
  margin-top: 64px;
`;
