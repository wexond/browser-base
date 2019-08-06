import styled, { css } from 'styled-components';

import { ITheme } from '~/interfaces';
import { TOOLBAR_HEIGHT } from '../../constants';

export const StyledToolbar = styled.div`
  position: relative;
  z-index: 100;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: ${TOOLBAR_HEIGHT}px;
<<<<<<< HEAD
=======
  padding-right: ${platform() !== 'darwin' ? 138 : 0}px;
>>>>>>> feat: add toolbar under the tab bar

  ${({
    isHTMLFullscreen,
    theme,
  }: {
    isHTMLFullscreen: boolean;
    theme: ITheme;
  }) => css`
    transition: ${theme.animations ? '0.2s background-color' : 'none'};
    margin-top: ${isHTMLFullscreen ? -TOOLBAR_HEIGHT : 0}px;
<<<<<<< HEAD
    background-color: ${theme['toolbar.backgroundColor']};
=======
    background-color: ${overlayType !== 'default'
      ? theme['toolbar.overlay.backgroundColor']
      : theme['toolbar.backgroundColor']};
>>>>>>> feat: add toolbar under the tab bar
  `};
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin-right: 2px;
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
