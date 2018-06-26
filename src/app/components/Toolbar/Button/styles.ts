import styled, { css } from 'styled-components';
import images from '../../../../shared/mixins/images';
import { TOOLBAR_BUTTON_WIDTH } from '../../../constants';
import opacity from '../../../../shared/defaults/opacity';

export const Icon = styled.div`
  width: 100%;
  height: 100%;

  ${({ size, disabled, icon }: { size: number; disabled: boolean; icon: string }) => css`
    ${images.center(`${size}px`, `${size}px`)};
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
