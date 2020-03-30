import styled, { css } from 'styled-components';
import { TITLEBAR_HEIGHT } from '~/constants/design';
import { ITheme } from '~/interfaces';

// margin-top: ${isHTMLFullscreen ? -TOOLBAR_HEIGHT : 0}px;

export const StyledTitlebar = styled.div`
  position: relative;
  z-index: 100;
  display: flex;
  flex-flow: row;
  color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: ${TITLEBAR_HEIGHT}px;

  &:before {
    position: absolute;
    z-index: 0;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 0px;
    -webkit-app-region: drag;
    content: '';
  }

  ${({
    isHTMLFullscreen,
    theme,
  }: {
    isHTMLFullscreen: boolean;
    theme: ITheme;
  }) => css`
    background-color: ${theme['titlebar.backgroundColor']};
  `};
`;
