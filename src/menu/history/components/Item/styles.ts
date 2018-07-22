import styled, { css } from 'styled-components';
import opacity from '../../../../shared/defaults/opacity';
import images from '../../../../shared/mixins/images';

const removeIcon = require('../../../../shared/icons/close.svg');

export const RemoveIcon = styled.div`
  position: absolute;
  left: 24px;
  height: 16px;
  width: 16px;
  ${images.center('24px', 'auto')};
  background-image: url(${removeIcon});
  z-index: 2;

  &:hover {
    opacity: ${opacity.light.activeIcon};
  }

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? opacity.light.inactiveIcon : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;
