import styled, { css } from 'styled-components';
import { opacity } from '../../../defaults/transparency';
import { ButtonType } from '../../../enums';
import {
  getComponentColor,
  getComponentOpacity,
} from '../../../utils/component-color';
import { button, centerImage, shadows } from '../../mixins';

type UITheme = 'light' | 'dark';

const isTransparent = (type: ButtonType) =>
  type === ButtonType.Outlined || type === ButtonType.Text;

const getPadding = (icon: boolean) => (icon ? 8 : 16);

const getBackground = (
  background: string,
  disabled: boolean,
  type: ButtonType,
  theme: UITheme,
) => {
  if (isTransparent(type)) {
    return 'transparent';
  }
  return getComponentColor(background, true, disabled, theme);
};

const getBorder = (type: ButtonType, theme: UITheme) => {
  if (type === ButtonType.Outlined) {
    const rgb = theme === 'light' ? 0 : 255;
    const alpha =
      theme === 'light' ? opacity.light.dividers : opacity.dark.dividers;

    return `1px solid rgba(${rgb}, ${rgb}, ${rgb}, ${alpha})`;
  }

  return 'unset';
};

const getBoxShadow = (type: ButtonType, disabled: boolean, z: number = 2) => {
  if (!disabled && !isTransparent(type)) {
    return shadows(z);
  }
  return 'unset';
};

const iconInvertColors = (
  white: boolean,
  theme: UITheme,
  disabled: boolean,
) => {
  if (disabled) {
    if (theme === 'dark') {
      return 'filter: invert(100%);';
    }
  } else if (white) {
    return 'filter: invert(100%);';
  }

  return null;
};

export interface StyledButtonProps {
  background: string;
  foreground: string;
  icon: boolean;
  disabled: boolean;
  type: ButtonType;
  theme: UITheme;
}

export const StyledButton = styled.div`
  display: inline-flex;
  min-width: 64px;
  height: 36px;
  padding-right: 16px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: 0.2s box-shadow;
  white-space: nowrap;
  overflow: hidden;

  ${button()};

  ${({
    background,
    foreground,
    icon,
    disabled,
    type,
    theme,
  }: StyledButtonProps) => css`
    background-color: ${getBackground(background, disabled, type, theme)};
    color: ${getComponentColor(foreground, true, disabled, theme, false)}};
    border: ${getBorder(type, theme)};
    box-shadow: ${getBoxShadow(type, disabled)};
    padding-left: ${getPadding(icon)}px;
    cursor: ${disabled ? 'unset' : 'pointer'};

    &:hover .overlay {
      opacity: ${disabled ? 0 : 0.12};
      box-shadow: ${getBoxShadow(type, disabled, 3)};
    }
  `};
`;

export interface IconProps {
  src: string;
  white: boolean;
  disabled: boolean;
  theme: UITheme;
}

export const Icon = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 4px;
  margin-right: 8px;

  ${centerImage('18px', 'auto')};

  ${({ src, white, disabled, theme }: IconProps) => css`
    background-image: url(${src});
    opacity: ${getComponentOpacity(true, disabled, theme, false)};

    ${iconInvertColors(white, theme, disabled)};
  `};
`;

export const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  transition: 0.2s opacity;

  ${({ color }: { color: string }) => css`
    background-color: ${color};
  `};
`;
