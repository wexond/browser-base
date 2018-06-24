import styled from 'styled-components';
import images from '../../../../shared/mixins/images';
import { TOOLBAR_BUTTON_WIDTH } from '../../../constants';
import opacity from '../../../../shared/defaults/opacity';
import { Theme } from '../../../../shared/models/theme';

interface IconProps {
  size: number;
  icon: string;
  disabled: boolean;
  theme?: Theme;
}

export const Icon = styled.div`
  width: 100%;
  height: 100%;

  ${({ size }: IconProps) => images.center(`${size}px`, `${size}px`)}
  opacity: ${({ disabled }) => (disabled ? opacity.light.disabledIcon : 0.65)};
  background-image: ${({ icon }) => `url(${icon})`};
`;

interface ButtonProps {
  theme?: Theme;
  disabled: boolean;
}

export const Button = styled.div`
  height: 100%;
  -webkit-app-region: no-drag;
  position: relative;
  transition: 0.2s background-color;

  filter: ${({ theme }: ButtonProps) =>
    (theme.toolbarButtons.color === 'light' ? 'invert(100%)' : '')};
  width: ${TOOLBAR_BUTTON_WIDTH}px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;
