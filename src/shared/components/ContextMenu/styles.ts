import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import shadows from '../../mixins/shadows';

const x = 64;
const easing = 'cubic-bezier(0.215, 0.61, 0.355, 1)';

export interface StyledMenuProps {
  visible: boolean;
  width: number;
  dense: boolean;
}

export const StyledMenu = styled.div`
  border-radius: 2px;
  height: 0;
  background-color: white;
  overflow: hidden;

  box-shadow: ${shadows(5)};

  opacity: ${({ visible }: StyledMenuProps) => (visible ? 1 : 0)};
  margin-top: ${({ visible }) => (visible ? 0 : -20)}px;
  width: ${({ width }) => width}px;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`;
