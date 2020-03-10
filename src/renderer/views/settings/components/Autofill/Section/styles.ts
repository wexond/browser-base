import styled, { css } from 'styled-components';
import { centerIcon } from '~/renderer/mixins';
import { transparency, ICON_DROPDOWN } from '~/renderer/constants';
import { ITheme } from '~/interfaces';

export const StyledSection = styled.div`
  width: 100%;
  border-radius: 4px;
  margin-top: 12px;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['pages.lightForeground']
      ? 'rgba(255, 255, 255, 0.04)'
      : 'rgba(0, 0, 0, 0.04)'};
  `};
`;

export const Header = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Icon = styled.div`
  width: 18px;
  height: 18px;
  opacity: ${transparency.icons.inactive};
  margin-left: 16px;
  ${centerIcon('contain')};

  ${({ icon, theme }: { icon: string; theme?: ITheme }) => css`
    background-image: url(${icon});
    filter: ${theme['pages.lightForeground'] ? 'invert(100%)' : 'none'};
  `};
`;

export const Label = styled.div`
  margin-left: 16px;
  font-size: 14px;
`;

export const DropIcon = styled.div`
  width: 20px;
  height: 20px;
  background-image: url(${ICON_DROPDOWN});
  opacity: ${transparency.icons.inactive};
  margin-left: auto;
  margin-right: 16px;
  ${centerIcon('contain')};

  ${({ expanded, theme }: { expanded: boolean; theme?: ITheme }) => css`
    transform: ${expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
    filter: ${theme['pages.lightForeground'] ? 'invert(100%)' : 'none'};
  `}
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 16px;
  padding-top: 0px;

  ${({ expanded }: { expanded: boolean }) => css`
    display: ${expanded ? 'block' : 'none'};
  `};
`;
