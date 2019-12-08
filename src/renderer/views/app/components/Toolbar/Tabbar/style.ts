import styled, { css } from 'styled-components';

import { ToolbarButton } from '../ToolbarButton';
import { TOOLBAR_BUTTON_WIDTH } from '~/constants/design';
import { ITheme } from '~/interfaces';

export const StyledTabbar = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: 0.3s opacity, 0.3s transform;
  margin-left: 8px;
  margin-right: 32px;
  display: flex;
`;

export const TabsContainer = styled.div`
  height: 100%;
  width: calc(100% - ${TOOLBAR_BUTTON_WIDTH}px);
  position: relative;
  overflow: hidden;
  overflow-x: overlay;
  white-space: nowrap;
  display: flex;
  align-items: center;

  &::-webkit-scrollbar {
    height: 0px;
    display: none;
    -webkit-app-region: no-drag;
    background-color: transparent;
    opacity: 0;
  }

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
`;

export const AddTab = styled(ToolbarButton)`
  position: absolute;
  left: 0;
  top: 0;
`;
