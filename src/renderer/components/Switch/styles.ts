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
  transition: 0.15s background-color;

  ${({ activated, color, theme }: Props) => css`
    background-color: ${activated ? color : theme['switch.backgroundColor']};
  `}
`;

export const Thumb = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 100%;
  position: absolute;
  transition: 0.15s left;
  ${centerVertical()};

  ${({ activated }: { activated: boolean }) => css`
    left: ${activated ? 22 : 2}px;
    background-color: #fff;
  `}
`;
