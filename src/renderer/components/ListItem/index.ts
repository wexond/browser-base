import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 48px;
  overflow: hidden;
  ${({ selected, theme }: { selected: boolean; theme?: ITheme }) => css`
    background-color: ${
      selected
        ? theme['pages.lightForeground']
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.08)'
        : 'transparent'
    };
      color: ${theme['pages.lightForeground'] ? '#fff' : '#000'}
    &:hover {
      background-color: ${
        theme['pages.lightForeground']
          ? `rgba(255, 255, 255, ${selected ? 0.12 : 0.08})`
          : `rgba(0, 0, 0, ${selected ? 0.08 : 0.04})`
      };
    }
  `};
`;
