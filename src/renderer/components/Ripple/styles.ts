import styled, { css } from 'styled-components';
import { hexToRgb } from '../../../utils';

export const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
  pointer-events: none;
`;

const easing = 'cubic-bezier(0.215, 0.61, 0.355, 1)';

export interface StyledRippleProps {
  color: string;
  opacity: number;
  rippleTime: number;
  fadeOutTime: number;
  opacityTransition: boolean;
  sizeTransition: boolean;
}

export const StyledRipple = styled.div`
  position: absolute;
  border-radius: 50%;
  transform: translate3d(-50.1%, -50.1%, 0);
  overflow: hidden;
  pointer-events: none;

  ${({
    rippleTime,
    fadeOutTime,
    color,
    opacity,
    opacityTransition,
    sizeTransition,
  }: StyledRippleProps) => css`
    transition: 0.3s background-color
      ${sizeTransition
        ? `, ${rippleTime}s width ${easing}, ${rippleTime}s height ${easing}`
        : ``}
      ${opacityTransition ? `, ${fadeOutTime}s opacity` : ``};
    background-color: ${color};
    opacity: ${opacity};
  `};
`;
