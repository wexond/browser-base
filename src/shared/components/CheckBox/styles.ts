import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import { UITheme } from '../../enums';
import icons from '../../mixins/icons';
import images from '../../mixins/images';
import userSelection from '../../mixins/user-selection';
import { getComponentColor } from '../../utils/component-color';
import Cursors from '../../mixins/cursors';
import { TransparencyText } from '../../models/transparency';
import typography from '../../mixins/typography';

const checkIcon = require('../../icons/check.svg');


export interface IStyledCheckboxProps {
  scaleAnimation: boolean;
}

export interface IBorderProps {
  checked: boolean;
  color: string;
  borderWidth: number;
  disabled: boolean;
  theme: UITheme;
  transition: string;
}

export interface IIconProps {
  transition: string;
  pathAnimation: boolean;
  scaleAnimation: boolean;
  theme: UITheme;
}

export interface IContainerProps {
  disabled?: boolean;
}

export interface ITextProps {
  disabled: boolean;
  theme: UITheme;
}

export const StyledCheckbox = styled.div`
  width: 18px;
  height: 18px;
  position: relative;
  transform: translate3d(0, 0, 0) translateZ(0);
  transition: 0.4s transform;
  -webkit-font-smoothing: subpixel-antialiased;
  ${(props: IStyledCheckboxProps) =>
    !props.scaleAnimation ? 'scale(1)' : 'scale(0.92)'};
  ${userSelection.noTapHighlight()};
`;

export default StyledCheckbox;

export const Border = styled.div`
  width: 100%;
  height: 100%;
  border-style: solid;
  border-radius: 3px;
  box-sizing: border-box;
  border-width: ${(props: IBorderProps) => props.borderWidth}px;
  border-color: ${(props: IBorderProps) =>
    getComponentColor(props.color, props.checked, props.disabled, props.theme)};
  transition: ${props => props.transition};
`;

export const Icon = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-font-smoothing: antialiased;
  clip-path: ${(props: IIconProps) =>
    props.pathAnimation ? 'inset(0 0 0 0)' : 'inset(100% 50% 0 50%)'};
  transform: ${props => (!props.scaleAnimation ? 'scale(1)' : 'scale(0)')};
  ${props => (props.theme === UITheme.Light ? icons.invertColors() : '')}
  transition: ${props => props.transition};
  background-image: ${`url(${checkIcon})`};
  ${images.center('22px', 'auto')}
`;

export const Container = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  -webkit-font-smoothing: antialiased;

  ${(props: IContainerProps) => props.disabled && 'pointer-events: none;'};
  ${Cursors.pointer()};
`;

const transparency = TransparencyText;
const getComponentForeground = (
  disabled: boolean,
  theme: UITheme,
  opacity = {
    disabled: {
      light: transparency.light.disabled,
      dark: transparency.dark.disabled
    },
    enabled: {
      light: transparency.light.inactive,
      dark: transparency.dark.inactive
    }
  }
) => {
  if (disabled) {
    if (theme === UITheme.Light) {
      return `rgba(0,0,0,${opacity.disabled.light})`;
    }
    return `rgba(255,255,255,${opacity.disabled.dark})`;
  }
  if (theme === UITheme.Light) {
    return `rgba(0,0,0,${opacity.enabled.light})`;
  }
  return `rgba(255,255,255,${opacity.enabled.dark})`;
};

export const ComponentText = styled.div`
  margin-left: 8px;
  margin-right: 24px;
  font-size: 15px;
  opacity: ${(props: ITextProps) => 1};
  color: ${props => getComponentForeground(props.disabled, props.theme)};
  ${typography.body2()};
`;

