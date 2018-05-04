import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

export const StyledPageLayout = styled.div`
  width: 100%;
  height: 100%;
`;

export const Content = styled.div`
  width: calc(100% - 320px);
  height: calc(100% - 56px);
  margin-top: 56px;
  margin-left: 320px;
  overflow: auto;
`;
