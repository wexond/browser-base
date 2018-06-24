import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import shadows from '../../mixins/shadows';

const x = 64;
const easing = 'cubic-bezier(0.215, 0.61, 0.355, 1)';

export interface IStyledMenuProps {
  visible: boolean;
  large: boolean;
  dense: boolean;
}

export const StyledMenu = styled.div`
  border-radius: 2px;
  height: 0;
  background-color: white;
  overflow: hidden;

  box-shadow: ${shadows(5)};

  opacity: ${({ visible }: IStyledMenuProps) => (visible ? 1 : 0)};
  margin-top: ${({ visible }) => (visible ? 0 : -15)}px;
  width: ${({ large }) => (large ? 3 * x : 2 * x)}px;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`;
