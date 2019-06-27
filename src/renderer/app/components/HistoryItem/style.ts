import styled, { css } from 'styled-components';

import { centerIcon } from '~/shared/mixins';
import { icons } from '../../constants';
import { Theme } from '../../models/theme';

export const Remove = styled.div`
  height: 16px;
  width: 16px;
  cursor: pointer;
  opacity: 0.54;
  background-image: url(${icons.close});
  ${centerIcon()};

  ${({ theme }: { theme?: Theme }) => css`
    filter: ${theme['overlay.foreground'] === 'light'
      ? 'invert(100%)'
      : 'none'};
  `};

  &:hover {
    opacity: 1;
  }
`;

export const Favicon = styled.div`
  ${centerIcon()};
  height: 16px;
  width: 16px;
  margin-right: 24px;
`;

export const Title = styled.div`
  flex: 3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 16px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const Site = styled.div`
  flex: 2;
  opacity: 0.54;
`;

export const Time = styled.div`
  flex: 1;
  opacity: 0.54;
`;
