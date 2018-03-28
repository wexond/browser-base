import styled from 'styled-components';
import { transparency } from 'nersent-ui';

// Enums
import { Platforms } from '../../../shared/enums';

import Store from '../../store';

interface INavIconsProps {
  isFullscreen: boolean;
}

export const NavIcons = styled.div`
  margin-left: ${(props: INavIconsProps) =>
    (!props.isFullscreen && Store.platform === Platforms.MacOS ? 78 : 0)}px;
  display: flex;
  -webkit-app-region: no-drag;
`;

export const Line = styled.div`
  height: 1px;
  width: 100%;
  position: absolute;
  z-index: 1;
  bottom: 0;

  background-color: ${props =>
    (props.theme.toolbar.foreground === 'white'
      ? `rgba(255, 255, 255, ${transparency.dark.dividers})`
      : `rgba(0, 0, 0, ${transparency.light.dividers})`)};
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
