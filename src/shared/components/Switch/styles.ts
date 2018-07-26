import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import Cursors from '../../mixins/cursors';
import { Align, UITheme } from '../../enums';
import Positioning from '../../mixins/positioning';
import Shadows from '../../mixins/shadows';
import typography from '../../mixins/typography';
import { getComponentColor } from '../../utils/component-color';
import { TransparencyText } from '../../models/transparency';

export interface IContainerProps {
  disabled?: boolean;
}

export interface ITrackProps {
  toggled: boolean;
  disabled: boolean;
  color: string;
  theme: UITheme;
}

export interface IThumbProps {
  toggled: boolean;
  disabled: boolean;
  color: string;
  theme: UITheme;
  thumbScaleAnimation: boolean;
}

export interface IThumbContainerProps {
  toggled: boolean;
  left: number;
}

export interface ITextProps {
  disabled: boolean;
  theme: UITheme;
}

const getThumbBackgroundColor = (props: IThumbProps) => {
  const { disabled, toggled, color, theme } = props;

  if (disabled) {
    if (theme === UITheme.Light) {
      return '#BDBDBD';
    }
    return '#424242';
  } else if (!toggled) {
    if (theme === UITheme.Light) {
      return '#FAFAFA';
    }
    return '#BDBDBD';
  }
  return color;
};

const getTrackBackgroundColor = (props: ITrackProps) => {
  const { disabled, toggled, color, theme } = props;

  if (disabled) {
    if (props.theme === UITheme.Light) {
      return 'rgba(0,0,0,0.12)';
    }
    return 'rgba(255,255,255,0.10)';
  } else if (!toggled) {
    if (props.theme === UITheme.Light) {
      return 'rgba(0,0,0,0.38)';
    }
    return 'rgba(255,255,255,0.30)';
  }
  return color;
};

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

export const Container = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  -webkit-font-smoothing: antialiased;

  ${(props: IContainerProps) => props.disabled && 'pointer-events: none;'};
  ${Cursors.pointer()};
`;

export const StyledSwitch = styled.div`
  width: 24px;
  height: 14px;
  position: relative;
`;

export const ThumbContainer = styled.div`
  position: absolute;
  transition: 0.25s left ease-out;
  left: ${(props: IThumbContainerProps) => props.left}px;
  ${Positioning.center(Align.CenterVertical)};
`;

export const Thumb = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  transition: 0.2s transform, 0.2s background-color;
  background-color: ${(props: IThumbProps) => getThumbBackgroundColor(props)};
  transform: ${props =>
    !props.thumbScaleAnimation ? 'scale(1)' : 'scale(0.9)'};
  box-shadow: ${Shadows(2)};
`;

export const Track = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 15px;
  transition: 0.2s opacity, 0.2s background-color;
  opacity: ${(props: ITrackProps) => (props.toggled ? 0.5 : 1)};
  background-color: ${props => getTrackBackgroundColor(props)};
`;

export const ComponentText = styled.div`
  margin-left: 8px;
  margin-right: 24px;
  font-size: 15px;
  opacity: ${(props: ITextProps) => 1};
  color: ${props => getComponentForeground(props.disabled, props.theme)};
  ${typography.body2()};
`;
