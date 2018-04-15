import { transparency } from 'nersent-ui';
import styled from 'styled-components';
import { Platforms } from '../../enums';
import Store from '../../store';

interface NavIconsProps {
  isFullscreen: boolean;
}

export const NavIcons = styled.div`
  margin-left: ${(props: NavIconsProps) =>
    (!props.isFullscreen && Store.platform === Platforms.MacOS ? 72 : 0)}px;
  display: flex;
  -webkit-app-region: no-drag;
`;

export const Line = styled.div`
  height: 1px;
  width: 100%;
  position: absolute;
  z-index: 1;
  bottom: 0;

  background-color: rgba(0, 0, 0, ${transparency.light.dividers});
`;

export const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
  overflow: hidden;
`;

export const TabsSection = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
`;

export const Handle = styled.div`
  position: absolute;
  left: 3px;
  top: 3px;
  right: 3px;
  bottom: 0px;
  -webkit-app-region: drag;
`;
