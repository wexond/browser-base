import styled, { css } from 'styled-components';
import { platform } from 'os';

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
  -webkit-app-region: drag;
  padding-right: ${platform() !== 'darwin' ? 138 : 0}px;
  transition: 0.2s background-color;

  ${({
    isHTMLFullscreen,
    theme,
    overlayType,
  }: {
    isHTMLFullscreen: boolean;
    theme: ITheme;
    overlayType: string;
  }) => css`
    margin-top: ${isHTMLFullscreen ? -TOOLBAR_HEIGHT : 0}px;
    background-color: ${overlayType !== 'default'
      ? theme['toolbar.overlay.backgroundColor']
      : theme['toolbar.backgroundColor']};
  `};
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
`;

export const Separator = styled.div`
  height: 16px;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.12);
  margin-left: 8px;
  margin-right: 8px;
`;
