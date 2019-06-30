import styled, { css } from 'styled-components';

import { EASING_FUNCTION, transparency, icons } from '~/renderer/constants';
import {
  centerVertical,
  robotoMedium,
  robotoRegular,
  centerIcon,
  shadows,
} from '~/renderer/mixins';

export const StyledDropdown = styled.div`
  min-width: 112px;
  height: 48px;
  position: relative;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  user-select: none;
  background-color: #f5f5f5;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: 0.15s border-bottom;

  ${({ activated }: { activated: boolean }) => css`
    border-bottom: ${activated
      ? '1px solid transparent'
      : '1px solid rgba(0, 0, 0, 0.42)'};
  `}
`;

interface LabelProps {
  activated: boolean;
  focused: boolean;
  color: string;
}

export const Label = styled.div`
  left: 12px;
  position: absolute;
  transition: 0.2s font-size, 0.2s color, 0.2s margin-top;
  transition-timing-function: ${EASING_FUNCTION};
  -webkit-font-smoothing: antialiased;
  ${centerVertical()};

  ${({ activated, focused, color }: LabelProps) => css`
    font-size: ${focused ? 12 : 16}px;
    margin-top: ${focused ? -12 : 0}px;
    color: ${activated ? color : `rgba(0, 0, 0, ${transparency.text.medium})`};
    ${focused ? robotoMedium() : robotoRegular()};
  `}
`;

export const DropIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-left: auto;
  margin-right: 8px;
  opacity: ${transparency.icons.inactive};
  background-image: url(${icons.dropDown});
  transition: 0.2s ${EASING_FUNCTION} transform;
  ${centerIcon(24)};

  ${({ activated }: { activated: boolean }) => css`
    transform: ${activated ? 'rotate(180deg)' : 'rotate(0deg)'};
  `}
`;

export const Menu = styled.div`
  width: 100%;
  height: fit-content;
  border-radius: 4px;
  overflow: hidden;
  position: absolute;
  top: 100%;
  z-index: 1000;
  padding: 8px 0px;
  background-color: #fff;
  transition: 0.15s opacity, 0.15s margin-top ${EASING_FUNCTION};
  box-shadow: ${shadows(3)};

  ${({ visible }: { visible: boolean }) => css`
    pointer-events: ${visible ? 'auto' : 'none'};
    opacity: ${visible ? 1 : 0};
    margin-top: ${visible ? 0 : -16}px;
  `}
`;

export const Indicator = styled.div`
  height: 2px;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.2s width ${EASING_FUNCTION};

  ${({ activated, color }: { activated: boolean; color: string }) => css`
    width: ${activated ? 100 : 0}%;
    background-color: ${color};
  `}
`;

export const Value = styled.div`
  font-size: 16px;
  left: 12px;
  position: absolute;
  margin-top: 6px;
  color: rgba(0, 0, 0, ${transparency.text.high});
  ${centerVertical()};
`;
