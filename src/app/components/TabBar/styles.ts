import styled from 'styled-components';
import ToolbarButton from '../ToolbarButton';

export const TabGroups = styled.div`
  transform: translateZ(0);
  position: relative;
  height: 100%;
`;

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

  pointer-events: ${(props: TabBarProps) => (props.visible ? 'auto' : 'none')};
  opacity: ${props => (props.visible ? 1 : 0)};
`;

export const AddTabButton = styled(ToolbarButton)`
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
`;
