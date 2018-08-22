import styled, { css } from 'styled-components';
import { shadows } from '@mixins';

export interface StyledMenuProps {
  visible: boolean;
  width: number;
  dense: boolean;
}

export const StyledMenu = styled.div`
  border-radius: 4px;
  background-color: white;
  overflow: hidden;
  position: absolute;
  z-index: 9999;

  box-shadow: ${shadows(8)};

  ${({ visible, width, dense }: StyledMenuProps) => css`
    visibility: ${visible ? 'visible' : 'hidden'};
    width: ${width}px;
    padding-top: ${dense ? 4 : 8}px;
    padding-bottom: ${dense ? 4 : 8}px;
  `};
`;
