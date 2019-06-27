import styled, { css } from 'styled-components';

import { centerIcon } from '~/shared/mixins';
import { icons } from '../../constants';
import { Theme } from '../../models/theme';

export const More = styled.div`
  ${centerIcon(20)};
  height: 24px;
  width: 24px;
  background-image: url(${icons.more});
  opacity: 0.54;

  ${({ theme }: { theme: Theme }) => css`
    filter: ${theme['overlay.foreground'] === 'light'
      ? 'invert(100%)'
      : 'none'};
  `}

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
