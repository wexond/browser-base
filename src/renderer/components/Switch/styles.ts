import styled, { css } from 'styled-components';

import { ITheme } from '~/interfaces';
import { centerVertical } from '~/renderer/mixins';

interface Props {
  activated: boolean;
  color: string;
  theme: ITheme;
  clickable: boolean;
}

export const StyledSwitch = styled.div`
  width: 40px;
  height: 20px;
  border-radius: 32px;
  position: relative;

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

  ${({ activated, color, theme, clickable }: Props) => css`
    background-color: ${activated ? color : theme['switch.backgroundColor']};
    cursor: ${clickable ? 'pointer' : 'default'};

    &:hover {
      &:after {
        background-color: ${!activated && theme['pages.lightForeground']
          ? 'rgba(0, 0, 0, 0.06)'
          : 'rgba(255, 255, 255, 0.12)'};
      }
    }
  `}
`;

export const Thumb = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 100%;
  position: absolute;
  z-index: 3;
  transition: 0.15s left;
  ${centerVertical()};

  ${({ activated }: { activated: boolean }) => css`
    left: ${activated ? 22 : 4}px;
    background-color: #fff;
  `}
`;
