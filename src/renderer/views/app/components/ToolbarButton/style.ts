import styled, { css } from 'styled-components';

import { centerIcon } from '~/renderer/mixins';
import {
  TOOLBAR_BUTTON_WIDTH,
  TOOLBAR_BUTTON_HEIGHT,
} from '~/constants/design';
import { ITheme } from '~/interfaces';

export const Icon = styled.div`
  width: 100%;
  height: 100%;
  will-change: background-image;
  transition: 0.15s background-image;
  backface-visibility: hidden;

  ${({
    size,
    disabled,
    opacity,
    autoInvert,
    theme,
    dense,
  }: {
    size: number;
    disabled: boolean;
    opacity: number;
    autoInvert?: boolean;
    dense?: boolean;
    theme?: ITheme;
  }) => css`
    ${centerIcon(size)};
    opacity: ${disabled ? 0.25 : opacity};
    filter: ${autoInvert && theme['toolbar.lightForeground']
      ? 'invert(100%)'
      : 'none'};
  `};
`;

export const Button = styled.div`
  border-radius: 2px;
  position: relative;
  transition: 0.2s background-color;
  backface-visibility: hidden;
  margin: 0 1px;

  ${({
    theme,
    toggled,
    disabled,
    dense,
  }: {
    theme: ITheme;
    toggled: boolean;
    disabled: boolean;
    dense: boolean;
  }) => css`
    border-radius: ${dense ? 2 : 4}px;
    height: ${dense ? 26 : TOOLBAR_BUTTON_HEIGHT}px;
    min-width: ${dense ? 34 : TOOLBAR_BUTTON_WIDTH}px;
    pointer-events: ${disabled ? 'none' : 'inherit'};
    -webkit-app-region: ${disabled ? 'drag' : 'no-drag'};

    background-color: ${toggled
      ? theme['toolbar.lightForeground']
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.1)'
      : 'none'};

    &:active {
      background-color: ${theme['toolbar.lightForeground']
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.1)'} !important;
    }

    ${!toggled &&
    css`
      &:hover {
        background-color: ${theme['toolbar.lightForeground']
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.06)'};
      }
    `};
  `};
`;

interface BadgeProps {
  background: string;
  color: string;
  right: number;
  top: number;
}

export const Badge = styled.div`
  position: absolute;
  padding: 1px 3px;
  border-radius: 8px;
  min-height: 6px;
  pointer-events: none;
  z-index: 5;
  font-size: 8px;
  ${({ background, color, top, right }: BadgeProps) => css`
    background-color: ${background};
    color: ${color};
    right: ${right}px;
    top: ${top}px;
  `};
`;

export const PreloaderBg = styled.div`
  width: 32px;
  height: 32px;

  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;

  ${({ theme }: { theme: ITheme }) => css`
    border: 3px solid
      ${theme['toolbar.lightForeground']
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.06)'};
  `};
`;
