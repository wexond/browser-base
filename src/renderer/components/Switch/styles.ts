import styled, { css } from 'styled-components';

import { ITheme } from '~/interfaces';
import { centerVertical } from '~/renderer/mixins';

interface Props {
  activated: boolean;
  color: string;
  theme: ITheme;
}

export const StyledSwitch = styled.div`
  width: 40px;
  height: 20px;
  border-radius: 32px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: 0.15s background-color;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
  }

  ${({ activated, color, theme }: Props) => css`
    background-color: ${activated ? color : theme['switch.backgroundColor']};

    &:hover {
      &:after {
        background-color: ${!activated && theme['overlay.foreground'] === 'dark'
          ? 'rgba(0, 0, 0, 0.06)'
          : 'rgba(255, 255, 255, 0.12)'};
      }
    }
  `}
`;

export const Thumb = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 100%;
  position: absolute;
  z-index: 3;
  transition: 0.15s left;
  ${centerVertical()};

  ${({ activated }: { activated: boolean }) => css`
    left: ${activated ? 22 : 2}px;
    background-color: #fff;
  `}
`;
