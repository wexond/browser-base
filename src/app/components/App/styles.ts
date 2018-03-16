import styled from "styled-components";

// Enums
import { Platforms } from "../../../shared/enums";

import Store from "../../store";

interface INavIconsProps {
  isFullscreen: boolean;
}

export const NavIcons = styled.div`
  margin-left: ${(props: INavIconsProps) => 
    !props.isFullscreen && Store.platform === Platforms.MacOS
    ? 78
    : 0}px};
  display: flex;
  -webkit-app-region: no-drag;
`;

export const Line = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
  position: absolute;
  z-index: 1;
  bottom: 0;
`;

export const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
  overflow: hidden;
`;

export const TabsSection = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  position: relative;
`;

interface IAddressBarProps {
  visible: boolean;
}

export const AddressBar = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: 0.2s opacity;

  -webkit-app-region: ${(props: IAddressBarProps) => props.visible ? "no-drag" : "drag"};
  opacity: ${props => props.visible ? 1 : 0};
`;
