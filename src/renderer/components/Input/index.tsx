import styled, { css } from 'styled-components';

import { ITheme } from '~/interfaces';

export const Input = styled.input`
  width: 200px;
  height: 32px;
  position: relative;
  border: none;
  outline: none;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0px 8px;

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme['control.backgroundColor']};
    color: ${theme['control.valueColor']};

    &:hover {
      background-color: ${theme['control.hover.backgroundColor']};
    }
  `}
`;
