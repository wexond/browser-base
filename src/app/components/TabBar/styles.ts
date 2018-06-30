import styled from 'styled-components';
import ToolbarButton from '../Toolbar/Button';

interface TabBarProps {
  visible: boolean;
}

export const StyledTabBar = styled.div`
  transform: translateZ(0);
  position: absolute;
  z-index: 8;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  transition: 0.2s opacity;
  overflow: hidden;

  pointer-events: ${({ visible }: TabBarProps) => (visible ? 'auto' : 'none')};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;
