import styled, { css } from 'styled-components';

import { centerIcon } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';
import { transparency } from '~/renderer/constants';

export const StyledNavigationDrawerItem = styled.div`
  padding: 4px 16px;
  display: flex;
  height: 40px;
  border-radius: 4px;
  align-items: center;
  position: relative;
  cursor: pointer;

  ${({ theme, selected }: { theme?: ITheme; selected?: boolean }) => css`
    &:hover {
      background-color: ${theme['pages.lightForeground']
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.04)'};
    }

    &:before {
      opacity: ${selected ? 1 : 0};
      background-color: ${theme['pages.lightForeground'] ? 'white' : 'black'};
    }
  `};

  &:before {
    content: '';
    position: absolute;
    left: 0;
    border-radius: 2px;
    width: 3px;
    height: 18px;
  }
`;

export const Icon = styled.div`
  height: 24px;
  width: 24px;
  min-width: 24px;
  opacity: ${transparency.icons.inactive};
  margin-right: 16px;
  ${centerIcon(20)};

  ${({ theme }: { theme?: ITheme }) => css`
    filter: ${theme['pages.lightForeground'] ? 'invert(100%)' : 'none'};
  `};
`;
