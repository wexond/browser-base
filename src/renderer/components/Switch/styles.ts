import styled, { css } from 'styled-components';

import { ITheme } from '~/interfaces';
import { shadows, centerVertical } from '~/renderer/mixins';
import { EASING_FUNCTION } from '~/renderer/constants';

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
    background-color: ${activated ? color : 'rgba(0, 0, 0, 0.16)'};
  `}
`;

export const Thumb = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 100%;
  position: absolute;
  box-shadow: ${shadows(2)};
  transition: 0.15s left ${EASING_FUNCTION};
  ${centerVertical()};

  ${({ activated, theme }: { activated: boolean; theme: ITheme }) => css`
  left: ${activated ? 22 : 2}px;
  background-color: #fff;
  `}
`;
