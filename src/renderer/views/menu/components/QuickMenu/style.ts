import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';
import { centerIcon, getLetterSpacing } from '~/renderer/mixins';
import { icons } from '~/renderer/constants';

export const Line = styled.div`
  height: 1px;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 4px;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['dialog.separator.color']};
  `};
`;

export const Background = styled.div`
  height: 250px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  ${({ theme }: { theme?: ITheme }) => css`
    background-image: ${theme['menu.header.background']};
  `};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: white;
  padding-bottom: 8px;
`;

export const MenuItem = styled.div`
  height: 36px;
  align-items: center;
  display: flex;
  position: relative;
  padding: 0 16px;
  font-size: 12px;
  letter-spacing: ${getLetterSpacing(12, 0.1)}rem;

  ${({ arrow }: { arrow?: boolean }) =>
    arrow &&
    css`
      &:after {
        content: '';
        position: absolute;
        right: 4px;
        width: 24px;
        height: 100%;
        opacity: 0.54;
        ${centerIcon(20)};
        background-image: url(${icons.arrowRight});
        ${({ theme }: { theme?: ITheme }) => css`
          filter: ${theme['dialog.lightForeground'] ? 'invert(100%)' : 'none'};
        `};
      }
    `};

  &:hover {
    ${({ theme }: { theme?: ITheme }) => css`
      background-color: ${theme['dialog.lightForeground']
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.03)'};
    `};
  }
`;

export const MenuItemTitle = styled.div`
  flex: 1;
`;

export const MenuItems = styled.div`
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  flex: 1;
  overflow: hidden;
  padding-top: 8px;
  padding-bottom: 8px;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['dialog.backgroundColor']};
    color: ${theme['dialog.textColor']};
  `};
`;

export const Content = styled.div`
  display: flex;
  flex-flow: column;
  position: relative;
`;

export const Icon = styled.div`
  margin-right: 16px;
  width: 20px;
  height: 20px;
  ${centerIcon()};
  opacity: 0.8;

  ${({ icon, theme }: { icon?: string; theme?: ITheme }) => css`
    background-image: url(${icon});
    filter: ${theme['dialog.lightForeground'] ? 'invert(100%)' : 'none'};
  `};
`;

export const Shortcut = styled.div`
  opacity: 0.54;
  margin-right: 16px;
`;
