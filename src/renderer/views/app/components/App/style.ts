import styled, { css } from 'styled-components';

import { ITheme } from '~/interfaces';

export const Line = styled.div`
  height: 1px;
  width: 100%;
  z-index: 2;
  position: relative;

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme['toolbar.bottomLine.backgroundColor']};
  `}
`;

export const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme.backgroundColor};
  `}
`;
