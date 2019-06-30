import styled, { css } from 'styled-components';

import { robotoRegular, centerVertical, robotoMedium, centerIcon, coloredCursor } from '~/renderer/mixins';
import { transparency, EASING_FUNCTION } from '~/renderer/constants';

export const StyledTextfield = styled.div`
  width: 280px;
  position: relative;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  overflow: hidden;
  background-color: #f5f5f5;
  cursor: text;
  user-select: none;
`;

interface InputProps {
  color: string;
  hasLabel: boolean;
  hasIcon: boolean;
}

export const Input = styled.input`
  width: 100%;
  height: 48px;
  font-size: 16px;
  color: #000;
  padding-left: 12px;
  border: none;
  outline: none;
  background-color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.42);
  user-select: auto;
  ${robotoRegular()};

  ${({ color, hasLabel, hasIcon }: InputProps) => css`
    padding-top: ${hasLabel ? 12 : 0}px;
    padding-right: ${hasIcon ? 48 : 12}px;
    ${coloredCursor(color)};
  `}

  &::placeholder {
    text-shadow: 0px 0px 0px rgba(0, 0, 0, ${transparency.text.medium});
  }
  &[type=number]::-webkit-inner-spin-button, &[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
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
    font-size: ${activated ? 12 : 16}px;
    margin-top: ${activated ? -12 : 0}px;
    color: ${focused ? color : `rgba(0, 0, 0, ${transparency.text.medium})`};
    ${activated ? robotoMedium() : robotoRegular()};
  `}
`;

export const Indicator = styled.div`
  height: 2px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  transition: 0.2s width ${EASING_FUNCTION};

  ${({ focused, color }: { focused: boolean, color: string }) => css`
    width: ${focused ? 100 : 0}%;
    background-color: ${color};
  `}
`;

export const Icon = styled.div`
  width: 36px;
  height: 36px;
  position: absolute;
  right: 8px;
  opacity: ${transparency.icons.inactive};
  border-radius: 100%;
  overflow: hidden;
  cursor: pointer;
  transition: 0.2s background-image;
  ${centerVertical()};
  ${centerIcon(24)};

  ${({ src }: { src: any }) => css`
    background-image: url(${src});
  `}

  &:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }
`;
