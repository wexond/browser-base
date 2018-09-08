import styled, { css } from 'styled-components';

import { TOOLBAR_HEIGHT } from '@/constants/app';
import { EASE_FUNCTION } from '@/constants/design';

export const Section = styled.div`
  display: flex;
  flex: 1;
  height: ${TOOLBAR_HEIGHT}px;
  -webkit-app-region: drag;
`;

export const StyledToolbar = styled.div`
  position: relative;
  z-index: 100;
  display: flex;
  flex-flow: column;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
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
