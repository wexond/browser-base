import styled, { css } from 'styled-components';
import { platform } from 'os';

import { ToolbarButton } from '../ToolbarButton';
import {
  TOOLBAR_BUTTON_WIDTH,
  ADD_TAB_BUTTON_WIDTH,
  ADD_TAB_BUTTON_HEIGHT,
} from '~/constants/design';
import { ITheme } from '~/interfaces';

export const StyledTabbar = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  align-items: center;
  margin-right: 32px;
  display: flex;
  margin-left: 4px;
`;

/* &:hover {
    ${({ theme }: { theme?: ITheme }) => css`
      &::-webkit-scrollbar-thumb {
        background-color: ${theme['toolbar.lightForeground']
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(0, 0, 0, 0.2)'};

        &:hover {
          background-color: ${theme['toolbar.lightForeground']
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(0, 0, 0, 0.3)'};
        }
      }
    `};
  } */

export const TabsContainer = styled.div`
  height: 100%;
  width: calc(100% - ${TOOLBAR_BUTTON_WIDTH}px);
  position: relative;
  overflow: hidden;
  overflow-x: overlay;
  white-space: nowrap;

  &::-webkit-scrollbar {
    height: 0px;
    display: none;
    background-color: transparent;
    opacity: 0;
  }
`;

export const AddTab = styled(ToolbarButton)`
  position: absolute;
  left: 0;
  min-width: ${ADD_TAB_BUTTON_WIDTH}px;
  height: ${ADD_TAB_BUTTON_HEIGHT}px;

  ${({ theme }: { theme: ITheme }) => css`
    top: ${theme.isCompact ? 'auto' : theme.tabMarginTop + 2}px;
  `};
`;
