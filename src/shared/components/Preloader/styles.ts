import * as React from 'react';

import styled, { StyledComponentClass } from 'styled-components';

export interface IPreloaderProps {
  size: number;
}

export const StyledPreloader = styled.div`
  width: ${(props: IPreloaderProps) => props.size}px;
  height: ${props => props.size}px;
  transform-origin: center center;
  animation: nersent-ui-preloader-rotate 2s linear infinite;
`;

export interface IPathProps {
  color: string;
  thickness: number;
}

export const Path = styled.circle`
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: nersent-ui-preloader-dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: square;
  stroke-width: ${(props: IPathProps) => props.thickness};
  stroke: ${props => props.color};
  transition: 0.3s stroke;
`;
