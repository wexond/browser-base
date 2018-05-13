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

  opacity: ${(props: IStyledMenuProps) => (props.visible ? 1 : 0)};
  margin-top: ${props => (props.visible ? 0 : -15)}px;
  width: ${props => (props.large ? 3 * x : 2 * x)}px;
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
`;
