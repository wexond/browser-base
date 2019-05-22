import styled, { css } from 'styled-components';

import { Theme } from '../../models/theme';

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 48px;

  ${({ selected, theme }: { selected: boolean; theme?: Theme }) => css`
    background-color: ${selected
      ? theme['overlay.foreground'] === 'light'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.04)'
      : 'transparent'};

    &:hover {
      background-color: ${theme['overlay.foreground'] === 'light'
        ? `rgba(255, 255, 255, ${selected ? 0.15 : 0.08})`
        : `rgba(0, 0, 0, ${selected ? 0.08 : 0.04})`};
    }
  `};
`;
