import styled from 'styled-components';
import { hexToRgb } from '../../../utils';

export const StyledRipples = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
  pointer-events: none;
`;

export interface IconRippleProps {
  width: number;
  height: number;
  color: string;
  hoverOverShade: boolean;
  disabled: boolean;
  size: number;
}

export const IconRipple = styled.div`
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  transition: 0.2s background-color;

  left: ${({ width }: IconRippleProps) => width / 2}px;
  top: ${({ height }) => height / 2}px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;

  &:hover {
    ${({ color, hoverOverShade, disabled }) => {
    const rgb = hexToRgb(color);

    if (hoverOverShade && !disabled) {
      return `background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04);`;
    }
    return '';
  }};
  }
`;
