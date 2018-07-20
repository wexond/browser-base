import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import opacity from '../../defaults/opacity';
import { getComponentColor, getComponentOpacity } from '../../utils/component-color';

import { invertColors } from '../../mixins/icons';
import images from '../../mixins/images';
import typography from '../../mixins/typography';
import shadows from '../../mixins/shadows';

import { ButtonType, UITheme } from '../../enums';

const isTransparent = (type: ButtonType) =>
  type === ButtonType.Outlined || type === ButtonType.Text;

const getPadding = (icon: boolean) => (icon ? 8 : 16);

const getBackground = (props: StyledButtonProps) => {
  const {
    background, disabled, type, theme,
  } = props;

  if (isTransparent(type)) return 'transparent';
  return getComponentColor(background, true, disabled, theme);
};

const getBorder = (props: StyledButtonProps) => {
  const { type, theme } = props;

  if (type === ButtonType.Outlined) {
    const rgb = theme === UITheme.Light ? 0 : 255;
    const alpha = theme === UITheme.Light ? opacity.light.dividers : opacity.dark.dividers;

    return `1px solid rgba(${rgb}, ${rgb}, ${rgb}, ${alpha})`;
  }

  return 'unset';
};

const getBoxShadow = (props: StyledButtonProps, z: number = 2) => {
  const { type, disabled } = props;

  if (!disabled && !isTransparent(type)) return shadows(z);
  return 'unset';
};

const iconInvertColors = (props: IconProps) => {
  const { white, theme, disabled } = props;

  if (disabled) {
    if (theme === UITheme.Dark) {
      return invertColors();
    }
  } else if (white) {
    return invertColors();
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

  ${typography.button()}
  background-color: ${(props: StyledButtonProps) => getBackground(props)};
  color: ${({ foreground, disabled, theme }) =>
    getComponentColor(foreground, true, disabled, theme, false)};
  border: ${props => getBorder(props)};
  box-shadow: ${props => getBoxShadow(props)};
  padding-left: ${({ icon }) => getPadding(icon)}px;
  cursor: ${({ disabled }) => (disabled ? 'unset' : 'pointer')};

  &:hover .overlay {
    opacity: ${({ disabled }) => (disabled ? 0 : 0.12)};

    box-shadow: ${props => getBoxShadow(props, 3)};
  }
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

  ${images.center('18px', 'auto')}
  background-image: url(${({ src }: IconProps) => src});
  opacity: ${({ disabled, theme }) => getComponentOpacity(true, disabled, theme, false)};
  ${props => iconInvertColors(props)} )
`;

export interface OverlayProps {
  color: string;
}

export const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  transition: 0.2s opacity;

  background-color: ${({ color }: OverlayProps) => color};
`;
