import styled from "styled-components";

export const TabGroups = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  height: 100%;
`;

interface IStyledTabBarProps {
  visible: boolean;
}

export const StyledTabBar = styled.div`
  position: absolute;
  z-index: 8;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  transition: 0.2s opacity;

  pointer-events: ${(props: IStyledTabBarProps) => props.visible ? "auto" : "none"};
  opacity: ${props => props.visible ? 1 : 0};
`;
