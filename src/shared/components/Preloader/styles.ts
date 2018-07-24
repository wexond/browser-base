import styled, { css } from 'styled-components';

export const StyledPreloader = styled.div`
  transform-origin: center center;
  animation: nersent-ui-preloader-rotate 2s linear infinite;
  z-index: 5;

  ${({ size }: { size: number }) => css`
    width: ${size}px;
    height: ${size}px;
  `};
`;

export const Path = styled.circle`
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: nersent-ui-preloader-dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: square;
  transition: 0.3s stroke;

  ${({ color, thickness }: { color: string; thickness: number }) => css`
    stroke-width: ${thickness};
    stroke: ${color};
  `};
`;
