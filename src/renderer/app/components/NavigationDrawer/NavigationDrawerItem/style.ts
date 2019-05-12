import styled, { css } from 'styled-components';
import { centerIcon } from '~/shared/mixins';
import { Theme } from '~/renderer/app/models/theme';

export const StyledNavigationDrawerItem = styled.div`
  padding: 0 16px;
  margin-left: 32px;
  margin-right: 32px;
  display: flex;
  height: 42px;
  align-items: center;
  position: relative;
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    width: 2px;
    height: 16px;
    background-color: white;
    ${({ selected, theme }: { selected?: boolean; theme?: Theme }) => css`
      opacity: ${selected ? 1 : 0};
      background-color: ${theme['overlay.foreground'] === 'light'
        ? 'white'
        : 'black'};
    `};
  }
  &:hover {
    ${({ theme }: { theme?: Theme }) => css`
      background-color: ${theme['overlay.foreground'] === 'light'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.04)'};
    `};
  }
`;

export const Icon = styled.div`
  height: 16px;
  width: 16px;
  ${centerIcon()};
  margin-right: 16px;

  ${({ theme }: { theme?: Theme }) => css`
    filter: ${theme['overlay.foreground'] === 'light'
      ? 'invert(100%)'
      : 'none'};
  `};
`;
