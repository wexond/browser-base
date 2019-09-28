import styled, { css } from 'styled-components';

import { ITheme } from '~/interfaces';
import { TOOLBAR_HEIGHT } from '~/constants/design';

export const StyledToolbar = styled.div`
  position: relative;
  z-index: 100;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: ${TOOLBAR_HEIGHT}px;

  ${({
    isHTMLFullscreen,
    theme,
  }: {
    isHTMLFullscreen: boolean;
    theme: ITheme;
  }) => css`
    margin-top: ${isHTMLFullscreen ? -TOOLBAR_HEIGHT : 0}px;
    background-color: ${theme['toolbar.backgroundColor']};
  `};
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
`;

export const Separator = styled.div`
  height: 16px;
  width: 1px;
  margin-left: 8px;
  margin-right: 8px;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['toolbar.separator.color']};
  `};
`;

export const Handle = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 0px;
  -webkit-app-region: drag;
`;
