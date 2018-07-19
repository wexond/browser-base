import styled from 'styled-components';

import opacity from '../../../../../shared/defaults/opacity';
import typography from '../../../../../shared/mixins/typography';
import images from '../../../../../shared/mixins/images';

const homeIcon = require('../../../../../shared/icons/home.svg');
const forwardIcon = require('../../../../../shared/icons/forward.svg');

export interface RootProps {
  hovered: boolean;
}

export const Root = styled.div`
  display: flex;
  align-items: center;
  margin-left: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s color;

  ${typography.robotoMedium()};
  color: ${({ hovered }: RootProps) =>
    `rgba(0, 0, 0, ${hovered ? opacity.light.primaryText : opacity.light.secondaryText})`};

  &:first-child {
    margin-left: 0px;
  }

  &:last-child .icon {
    display: none;
  }
`;

export interface IconProps {
  hovered: boolean;
}

export const Icon = styled.div`
  width: 16px;
  height: 16px;
  margin-left: 6px;
  background-image: url(${forwardIcon});
  transition: 0.2s opacity;

  ${images.center('100%', 'auto')};
  opacity: ${({ hovered }: IconProps) =>
    (hovered ? opacity.light.activeIcon : opacity.light.inactiveIcon)};
`;

export const HomeIcon = styled(Icon)`
  width: 20px;
  height: 20px;
  background-image: url(${homeIcon});
`;
