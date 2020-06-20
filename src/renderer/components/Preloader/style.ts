import styled, { css } from 'styled-components';

export const Spinner = styled.svg`
  transform-origin: center;

  ${({ indeterminate }: { indeterminate: boolean }) => css`
    animation: ${indeterminate ? `rotation 1.35s linear infinite` : ''};
  `};

  @keyframes turn {
    0% {
      stroke-dashoffset: 180;
    }

    50% {
      stroke-dashoffset: 45;
      -webkit-transform: rotate(135deg);
      transform: rotate(135deg);
    }

    100% {
      stroke-dashoffset: 180;
      -webkit-transform: rotate(450deg);
      transform: rotate(450deg);
    }
  }

  @keyframes rotation {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(270deg);
      transform: rotate(270deg);
    }
  }
`;

export const StyledPreloader = styled.div`
  z-index: 5;

  ${({ size, indeterminate }: { size: number; indeterminate: boolean }) => css`
    width: ${size}px;
    height: ${size}px;
  `};
`;

export const Path = styled.circle`
  stroke-linecap: square;
  transform-origin: center;

  ${({
    value,
    indeterminate,
  }: {
    value: number;
    indeterminate: boolean;
  }) => css`
    stroke-dasharray: ${indeterminate ? '180' : `0`};
    animation: ${indeterminate ? `turn 1.35s ease-in-out infinite` : ''};
  `};
`;
