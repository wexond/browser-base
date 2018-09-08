import styled, { css } from 'styled-components';

import { shadows } from '@/mixins';

export interface StyledMenuProps {
  visible: boolean;
  width: number;
}

export const StyledMenu = styled.div`
  border-radius: 4px;
  background-color: white;
  overflow: hidden;
  position: absolute;
  z-index: 9999;

  box-shadow: ${shadows(8)};

  ${({ visible, width }: StyledMenuProps) => css`
    visibility: ${visible ? 'visible' : 'hidden'};
    width: ${width}px;
    padding-top: 4px;
    padding-bottom: 4px;
  `};
`;
