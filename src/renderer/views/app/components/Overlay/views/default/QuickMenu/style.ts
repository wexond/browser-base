import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';

export const Line = styled.div`
  height: 4px;
  width: 32px;
  background-color: rgba(0, 0, 0, 0.12);
  border-radius: 20px;
  margin-top: 16px;
  margin-bottom: 8px;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['overlay.separator.color']};
  `};
`;
