import styled, { css } from 'styled-components';
import { button, centerImage } from 'mixins';
import { transparency } from 'defaults';

const isTransparent = (type: ButtonType) =>
  type === ButtonType.Outlined || type === ButtonType.Text;

const getPadding = (icon: boolean) => (icon ? 8 : 16);

const getBackground = (
  background: string,
  disabled: boolean,
  type: ButtonType,
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
      theme === 'light' ? transparency.light.dividers : transparency.dark.dividers;

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

export interface StyledButtonProps {
  background: string;
  foreground: string;
  icon: boolean;
  disabled: boolean;
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
  }: StyledButtonProps) => css`
    background-color: ${};
    color: ${};
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
}

export const Icon = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 4px;
  margin-right: 8px;

  ${centerImage('18px', 'auto')};

  ${({ src, white, disabled }: IconProps) => css`
    background-image: url(${src});
    opacity: ${disabled ? transparency.light.disabledIcon : transparency.light.inactiveIcon};
    filter: ${white ? 'invert(100%)' : ''};
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
