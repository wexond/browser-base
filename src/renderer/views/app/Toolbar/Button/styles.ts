import styled, { css } from 'styled-components';

import { TOOLBAR_BUTTON_WIDTH } from '../../../../../constants';
import { opacity } from '../../../../../defaults';
import { centerImage } from '../../../../mixins';

export const Icon = styled.div`
  width: 100%;
  height: 100%;
  will-change: background-image;
  transition: 0.15s background-image;

  ${({
    size,
    disabled,
    icon,
  }: {
    size: number;
    disabled: boolean;
    icon: string;
  }) => css`
    ${centerImage(`${size}px`, `${size}px`)};
    opacity: ${disabled ? 0.25 : opacity.light.inactiveIcon};
    background-image: url(${icon});
  `};
`;

export const Button = styled.div`
  height: 100%;
  -webkit-app-region: no-drag;
  position: relative;
  transition: 0.2s background-color;

  width: ${TOOLBAR_BUTTON_WIDTH}px;

  ${({ disabled }: { disabled: boolean }) => css`
    pointer-events: ${disabled ? 'none' : 'auto'};
  `};
`;

export const Circle = styled.div`
  border-radius: 50%;
  width: 34px;
  height: 34px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  transition: 0.2s background-color;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;
