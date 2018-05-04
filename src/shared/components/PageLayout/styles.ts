import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

export const StyledPageLayout = styled.div`
  width: 100%;
  height: 100%;
`;

export const Content = styled.div`
  width: 100%;
  height: calc(100% - 56px);
  margin-top: 64px;
  overflow: auto;
`;
