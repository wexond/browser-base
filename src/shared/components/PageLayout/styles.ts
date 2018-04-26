import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

export const StyledPageLayout = styled.div`
  width: 100%;
  height: 100%;
`;

export const Container = styled.div`
  width: calc(100% - 288px);
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  overflow: hidden;
`;

export const Content = styled.div`
  width: 100%;
  height: calc(100% - 64px);
  margin-top: 64px;
  overflow: auto;
`;
