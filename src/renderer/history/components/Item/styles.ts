import styled, { css } from 'styled-components';

import { icons, transparency } from '@/constants/renderer';
import { centerImage } from '@/mixins';

export const RemoveIcon = styled.div`
  position: absolute;
  left: 24px;
  height: 16px;
  width: 16px;
  z-index: 2;
  background-image: url(${icons.close});

  ${centerImage('24px', 'auto')};

  &:hover {
    opacity: ${transparency.light.activeIcon};
  }

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? transparency.light.inactiveIcon : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;
