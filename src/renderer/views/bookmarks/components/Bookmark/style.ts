import styled, { css } from 'styled-components';

import { centerIcon } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';
import { ICON_MORE } from '~/renderer/constants/icons';

export const More = styled.div`
  ${centerIcon(20)};
  height: 24px;
  width: 24px;
  cursor: pointer;
  background-image: url(${ICON_MORE});
  opacity: 0.54;
  ${({ theme }: { theme: ITheme }) => css`
    filter: ${theme['pages.lightForeground'] ? 'invert(100%)' : 'none'};
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
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 16px;

  ${({ theme }: { theme: ITheme }) => css`
    color: ${theme['pages.lightForeground'] ? '#fff' : '#000'};
  `}
`;

export const Site = styled.div`
  flex: 1;
  opacity: 0.54;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
