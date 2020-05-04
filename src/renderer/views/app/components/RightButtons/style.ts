import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4px;
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
