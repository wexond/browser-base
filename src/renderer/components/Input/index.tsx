import styled, { css } from 'styled-components';

import { ITheme } from '~/interfaces';
import { centerIcon } from '~/renderer/mixins';
import { ICON_DROPDOWN } from '~/renderer/constants/icons';

export const Control = css`
  height: 32px;
  position: relative;
  border: none;
  outline: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0px 8px;
  font-size: 12px;

  &:focus {
    box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.54);
  }

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme['control.backgroundColor']};
    color: ${theme['control.valueColor']};
  `}
`;

export const Input = styled.input.attrs(() => ({
  spellCheck: false,
}))`
  ${Control}
`;

export const Dropdown = styled.div`
  ${Control}

  &:after {
    content: '';
    position: absolute;
    right: 4px;
    height: 20px;
    width: 20px;
    ${centerIcon()};
    background-image: url(${ICON_DROPDOWN});

    ${({ dark }: { dark: boolean }) => css`
      filter: ${dark ? 'invert(100%)' : 'none'};
    `}
  }
`;
