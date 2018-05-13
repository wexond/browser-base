import styled from 'styled-components';
import images from '../../../../shared/mixins/images';
import { HOVER_DURATION, TOOLBAR_BUTTON_WIDTH } from '../../../constants/design';
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

  ${(props: IconProps) => images.center(`${props.size}px`, `${props.size}px`)}
  opacity: ${(props: IconProps) => {
    if (props.disabled) {
      return props.theme.toolbarButtons.color === 'light'
        ? opacity.dark.disabledIcon
        : opacity.light.disabledIcon;
    }
    return props.theme.toolbarButtons.color === 'light'
      ? opacity.dark.inactiveIcon
      : opacity.light.inactiveIcon;
  }};
  background-image: ${props => `url(${props.icon})`};
`;

interface ButtonProps {
  theme?: Theme;
  disabled: boolean;
}

export const Button = styled.div`
  height: 100%;
  -webkit-app-region: no-drag;
  position: relative;

  transition: ${HOVER_DURATION}s background-color;
  filter: ${(props: ButtonProps) =>
    (props.theme.toolbarButtons.color === 'light' ? 'invert(100%)' : '')};
  width: ${TOOLBAR_BUTTON_WIDTH}px;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;
