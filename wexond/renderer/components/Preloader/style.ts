import styled, { css } from 'styled-components';

export const StyledPreloader = styled.div`
  transform-origin: center center;
  animation: preloader-rotate 2s linear infinite;
  z-index: 5;
  ${({ size }: { size: number }) => css`
    width: ${size}px;
    height: ${size}px;
  `};

  @keyframes preloader-rotate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes preloader-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }
`;

export const Path = styled.circle`
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: preloader-dash 1.5s ease-in-out infinite,
    color 6s ease-in-out infinite;
  stroke-linecap: square;
  transition: 0.3s stroke;
  ${({ color, thickness }: { color: string; thickness: number }) => css`
    stroke-width: ${thickness};
    stroke: ${color};
  `};
`;
