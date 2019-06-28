import styled, { css } from 'styled-components';

import { centerIcon } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';

export const StyledNavigationDrawerItem = styled.div`
  padding: 0 16px;
  margin-left: 32px;
  margin-right: 32px;
  display: flex;
  height: 42px;
  align-items: center;
  position: relative;
  cursor: pointer;

  ${({ theme, selected }: { theme?: ITheme; selected?: boolean }) => css`
    &:hover {
      background-color: ${theme['overlay.foreground'] === 'light'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.04)'};
    }

    &:before {
      opacity: ${selected ? 1 : 0};
      background-color: ${theme['overlay.foreground'] === 'light'
        ? 'white'
        : 'black'};
    }
  `};

  &:before {
    content: '';
    position: absolute;
    left: 0;
    width: 2px;
    height: 16px;
    background-color: white;
  }
`;

export const Icon = styled.div`
  height: 16px;
  width: 16px;
  ${centerIcon()};
  margin-right: 16px;

  ${({ theme }: { theme?: ITheme }) => css`
    filter: ${theme['overlay.foreground'] === 'light'
      ? 'invert(100%)'
      : 'none'};
  `};
`;
