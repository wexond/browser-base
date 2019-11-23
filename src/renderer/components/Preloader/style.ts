import styled, { css } from 'styled-components';

export const StyledPreloader = styled.div`
  transform-origin: center center;
  z-index: 5;
  transform: rotate(-89deg);
  ${({ size, indeterminate }: { size: number; indeterminate: boolean }) => css`
    width: ${size}px;
    height: ${size}px;
    animation: ${indeterminate ? `preloader-rotate 2s linear infinite` : ''};
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
  stroke-linecap: square;
  ${({
    color,
    thickness,
    value,
    indeterminate,
  }: {
    color: string;
    thickness: number;
    value: number;
    indeterminate: boolean;
  }) => css`
    stroke-dasharray: ${indeterminate ? '1, 200' : `199, 200`};
    stroke-dashoffset: ${199 - value * (199 - 82)}px;
    stroke-width: ${thickness};
    stroke: ${color};
    animation: ${indeterminate
      ? `preloader-dash 1.5s ease-in-out infinite,
    color 6s ease-in-out infinite`
      : ''};
    transition: 0.3s stroke ${indeterminate ? ', 0.3s stroke-dasharray' : ''};
  `};
`;
