import styled, { css } from 'styled-components';
import { EASE_FUNCTION, TOOLBAR_HEIGHT } from '~/constants';
import { transparency } from '~/renderer/defaults';

export const StyledToolbar = styled.div`
  position: relative;
  z-index: 100;
  display: flex;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
  -webkit-app-region: drag;

  height: ${TOOLBAR_HEIGHT}px;
  transition: 0.2s margin-top ${EASE_FUNCTION};
  ${({ isHTMLFullscreen }: { isHTMLFullscreen: boolean }) => css`
    margin-top: ${isHTMLFullscreen ? -TOOLBAR_HEIGHT : 0}px;
  `};
`;

export const TabsSection = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
`;

export const Tabs = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
`;
