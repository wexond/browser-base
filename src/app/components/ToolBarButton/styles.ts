import styled from 'styled-components';

// Defaults and constants
import { transparency } from 'nersent-ui';
import { HOVER_DURATION, TOOLBAR_BUTTON_WIDTH } from '../../constants/design';

// Enums
import { Icons } from '../../enums';

// Mixins
import images from '../../../shared/mixins/images';

interface IIconProps {
  size: number;
  icon: Icons;
}

export const Icon = styled.div`
  width: 100%;
  height: 100%;

  opacity: ${transparency.light.icons.inactive};

  ${(props: IIconProps) => images.center(`${props.size}px`, `${props.size}px`)}
  background-image: ${props => `url(../../src/app/icons/${props.icon})`};
`;

export const Button = styled.div`
  height: 100%;
  -webkit-app-region: no-drag;
  position: relative;

  width: ${TOOLBAR_BUTTON_WIDTH}px;
  transition: ${HOVER_DURATION}s background-color;
`;
