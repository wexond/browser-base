import styled, { css } from 'styled-components';

import { EASING_FUNCTION, BLUE_500 } from '~/renderer/constants';
import { ICON_CHECK } from '~/renderer/constants/icons';
import { centerIcon, centerBoth } from '~/renderer/mixins';

export const Container = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;

  &:hover .checkbox::before {
    width: 40px;
    height: 40px;
    opacity: 0.08;
  }
`;

export const StyledCheckbox = styled.div`
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  position: relative;
  border-radius: 3px;
  border-width: 2px;
  border-style: solid;
  transition: 0.15s background-color, 0.15s border-color;

  ${({ toggled }: { toggled: boolean }) => css`
    background-color: ${toggled ? BLUE_500 : 'transparent'};
    border-color: ${toggled ? BLUE_500 : 'rgba(0, 0, 0, 0.54)'};

    &::before {
      background-color: ${toggled ? BLUE_500 : '#000'};
    }
  `}

  &::before {
    content: '';
    width: 0px;
    height: 0px;
    border-radius: 100%;
    display: block;
    position: absolute;
    pointer-events: none;
    opacity: 0;
    transition: 0.1s width ${EASING_FUNCTION}, 0.1s height ${EASING_FUNCTION},
      0.15s opacity, 0.15s background-color;
    ${centerBoth()};
  }
`;

export const Icon = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url(${ICON_CHECK});
  transition: 0.3s clip-path ${EASING_FUNCTION};
  -webkit-font-smoothing: antialiased;
  filter: invert(100%);
  ${centerIcon(22)};

  ${({ toggled }: { toggled: boolean }) => css`
    clip-path: ${toggled ? 'inset(0 0 0 0)' : 'inset(100% 50% 0 50%)'};
  `};
`;
