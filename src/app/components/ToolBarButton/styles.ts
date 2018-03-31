import { transparency } from 'nersent-ui';
import styled from 'styled-components';
import images from '../../../shared/mixins/images';
import { HOVER_DURATION } from '../../constants/design';
import { Icons } from '../../enums';
import Theme from '../../models/theme';

interface IconProps {
  size: number;
  icon: Icons;
}

export const Icon = styled.div`
  width: 100%;
  height: 100%;

  opacity: ${transparency.light.icons.inactive};
  ${(props: IconProps) => images.center(`${props.size}px`, `${props.size}px`)}
  background-image: ${props => `url(../../src/app/icons/${props.icon})`};
`;

interface ButtonProps {
  theme?: Theme;
}

export const Button = styled.div`
  height: 100%;
  -webkit-app-region: no-drag;
  position: relative;

  transition: ${HOVER_DURATION}s background-color;
  filter: ${(props: ButtonProps) => props.theme.toolbar.foreground === 'light' && 'invert(100%)'};
  width: ${(props: ButtonProps) => props.theme.toolbarButtons.width}px;
`;
