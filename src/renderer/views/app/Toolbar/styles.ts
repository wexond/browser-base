import styled, { css } from 'styled-components';
import { TOOLBAR_HEIGHT, EASE_FUNCTION } from '../../../../constants';
import { opacity } from '../../../../defaults';

export const StyledToolbar = styled.div`
  position: relative;
  z-index: 100;
  display: flex;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);

  height: ${TOOLBAR_HEIGHT}px;
  transition: 0.2s margin-top ${EASE_FUNCTION};
  ${({ isHTMLFullscreen }: { isHTMLFullscreen: boolean }) => css`
    margin-top: ${isHTMLFullscreen ? -TOOLBAR_HEIGHT : 0}px;
  `};
`;

export const Handle = styled.div`
  position: absolute;
  left: 3px;
  top: 3px;
  right: 3px;
  bottom: 0px;
  -webkit-app-region: drag;
`;

export const Line = styled.div`
  height: 1px;
  width: 100%;
  position: absolute;
  z-index: 1;
  bottom: 0;
  background-color: rgba(0, 0, 0, ${opacity.light.dividers});
`;

export const TabsSection = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
`;
