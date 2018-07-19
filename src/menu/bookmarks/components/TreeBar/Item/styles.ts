import styled from 'styled-components';

import opacity from '../../../../../shared/defaults/opacity';
import typography from '../../../../../shared/mixins/typography';
import images from '../../../../../shared/mixins/images';

const homeIcon = require('../../../../../shared/icons/home.svg');

export interface RootProps {
  hovered: boolean;
}

export const Root = styled.div`
  height: 32px;
  margin-left: 4px;
  padding-left: 4px;
  padding-right: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s background-color;

  &:first-child {
    margin-left: 0px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

export const Title = styled.div`
  padding-left: 2px;
  padding-right: 2px;
  font-size: 14px;
  color: rgba(0, 0, 0, ${opacity.light.primaryText});

  ${typography.robotoMedium()};
`;

export const HomeIcon = styled.div`
  width: 20px;
  height: 20px;
  background-image: url(${homeIcon});
  transition: 0.2s opacity;
  opacity: ${opacity.light.inactiveIcon};

  ${images.center('100%', 'auto')};
`;
