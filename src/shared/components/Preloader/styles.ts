import * as React from 'react';

import styled, { StyledComponentClass } from 'styled-components';

export interface PreloaderProps {
  size: number;
}

export const StyledPreloader = styled.div`
  transform-origin: center center;
  animation: nersent-ui-preloader-rotate 2s linear infinite;
  z-index: 5;

  width: ${({ size }: PreloaderProps) => size}px;
  height: ${({ size }) => size}px;
`;

export interface PathProps {
  color: string;
  thickness: number;
}

export const Path = styled.circle`
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: nersent-ui-preloader-dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: square;
  transition: 0.3s stroke;

  stroke-width: ${({ thickness }: PathProps) => thickness};
  stroke: ${({ color }) => color};
`;
