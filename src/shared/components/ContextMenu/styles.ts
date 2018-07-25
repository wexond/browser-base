import styled from 'styled-components';
import shadows from '../../mixins/shadows';

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
  display: block;
  padding-top: ${({ dense }) => (dense ? 4 : 8)}px;
  padding-bottom: ${({ dense }) => (dense ? 4 : 8)}px;

  box-shadow: ${shadows(5)};

  opacity: ${({ visible }: StyledMenuProps) => (visible ? 1 : 0)};
  margin-top: ${({ visible }) => (visible ? 0 : -20)}px;
  width: ${({ width }) => width}px;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`;
