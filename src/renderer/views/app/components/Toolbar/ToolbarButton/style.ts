import styled, { css } from 'styled-components';

import { centerIcon } from '~/renderer/mixins';
import { TOOLBAR_HEIGHT, TOOLBAR_BUTTON_WIDTH } from '../../../constants';
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
  }: {
    size: number;
    disabled: boolean;
    opacity: number;
  }) => css`
    ${centerIcon(size)};
    opacity: ${disabled ? 0.25 : opacity};
  `};
`;

export const Button = styled.div`
  height: ${TOOLBAR_HEIGHT}px;

  position: relative;
  transition: 0.2s background-color;
  width: ${TOOLBAR_BUTTON_WIDTH}px;
  backface-visibility: hidden;

  ${({
    disabled,
    invert,
    theme,
  }: {
    disabled: boolean;
    invert: boolean;
    theme: ITheme;
  }) => css`
    pointer-events: ${disabled ? 'none' : 'inherit'};
    -webkit-app-region: ${disabled ? 'drag' : 'no-drag'};
    filter: ${theme['toolbar.icons.invert'] ? 'invert(100%)' : 'none'};
  `};
`;

export const Circle = styled.div`
  border-radius: 50%;
  width: 32px;
  height: 32px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  transition: 0.2s background-color;
  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;
