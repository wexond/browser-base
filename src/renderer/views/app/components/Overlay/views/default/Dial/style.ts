import styled, { css } from 'styled-components';

import { centerIcon } from '~/renderer/mixins';
import { icons } from '~/renderer/constants';
import { ITheme } from '~/interfaces';
import { Title } from '../../../style';

export const Container = styled.div`
  position: relative;
`;

export const DropArrow = styled.div`
  ${centerIcon()};
  width: 24px;
  height: 24px;
  margin-left: 4px;
  opacity: 0.54;
  background-image: url(${icons.down});

  ${({ theme }: { theme?: ITheme }) => css`
    filter: ${theme['overlay.foreground'] === 'light'
      ? 'invert(100%)'
      : 'none'};
  `}
`;

export const DialTitle = styled(Title)`
  ${({ theme }: { theme?: ITheme }) => css`
    &:hover {
      background-color: ${theme['overlay.foreground'] === 'dark'
        ? 'rgba(0, 0, 0, 0.08)'
        : 'rgba(255, 255, 255, 0.08)'};
    }
  `}
`;
