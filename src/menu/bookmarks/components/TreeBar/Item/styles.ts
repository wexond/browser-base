import styled from 'styled-components';

import opacity from '../../../../../shared/defaults/opacity';
import typography from '../../../../../shared/mixins/typography';
import images from '../../../../../shared/mixins/images';

const forwardIcon = require('../../../../../shared/icons/forward.svg');

export const Root = styled.div`
  color: #000;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-left: 6px;
  cursor: pointer;

  ${typography.robotoLight()};

  &:first-child {
    margin-left: 0px;
  }

  &:last-child .icon {
    display: none;
  }
`;

export const Icon = styled.div`
  width: 16px;
  height: 16px;
  margin-left: 6px;
  background-image: url(${forwardIcon});
  opacity: ${opacity.light.inactiveIcon};

  ${images.center('100%', 'auto')};
`;
