import styled, { css } from 'styled-components';
import { platform } from 'os';

import { TOOLBAR_HEIGHT } from '~/renderer/app/constants/design';
import { Theme } from '../../models/theme';

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

  ${({
    isHTMLFullscreen,
    theme,
  }: {
    isHTMLFullscreen: boolean;
    theme: Theme;
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
  background-color: rgba(0, 0, 0, 0.12);
  margin-left: 8px;
  margin-right: 8px;
`;
