import styled from 'styled-components';

import opacity from '../../../../../shared/defaults/opacity';
import typography from '../../../../../shared/mixins/typography';
import images from '../../../../../shared/mixins/images';

const homeIcon = require('../../../../../shared/icons/home.svg');
const forwardIcon = require('../../../../../shared/icons/forward.svg');

export const Root = styled.div`
  display: flex;
  align-items: center;
  margin-left: 6px;
  cursor: pointer;
  font-size: 14px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
  transition: 0.2s color;

  ${typography.robotoRegular()};

  &:first-child {
    margin-left: 0px;
  }

  &:last-child .icon {
    display: none;
  }

  &:hover {
    color: rgba(0, 0, 0, ${opacity.light.primaryText});

    & .home-icon,
    & .icon {
      opacity: 1;
    }
  }
`;

export const Icon = styled.div`
  width: 16px;
  height: 16px;
  margin-left: 6px;
  background-image: url(${forwardIcon});
  opacity: ${opacity.light.inactiveIcon};
  transition: 0.2s opacity;

  ${images.center('100%', 'auto')};
`;

export const HomeIcon = styled(Icon)`
  width: 20px;
  height: 20px;
  background-image: url(${homeIcon});
`;
