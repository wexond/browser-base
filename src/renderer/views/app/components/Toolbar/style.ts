import styled, { css } from 'styled-components';

import { ITheme } from '~/interfaces';
import { TOOLBAR_HEIGHT } from '~/constants/design';

export const StyledToolbar = styled.div`
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
  flex-flow: row;
  color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: ${TOOLBAR_HEIGHT}px;

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme['toolbar.backgroundColor']};
    border-bottom: 1px solid ${theme['toolbar.bottomLine.backgroundColor']};
  `};
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4px;
`;

export const Addressbar = styled.div`
  height: 30px;
  flex: 1;
  border-radius: 4px;
  margin: 0 7px;

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme['addressbar.backgroundColor']};

    &:hover {
      border: ${theme['toolbar.lightForeground']
        ? '1px solid rgba(255, 255, 255, 0.12)'
        : '1px solid rgba(0, 0, 0, 0.12)'};
    }
  `};
`;

export const Separator = styled.div`
  height: 16px;
  width: 1px;
  margin-left: 4px;
  margin-right: 4px;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['toolbar.separator.color']};
  `};
`;
