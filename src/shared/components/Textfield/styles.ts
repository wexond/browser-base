import styled from 'styled-components';

import images from '../../mixins/images';
import typography from '../../mixins/typography';
import opacity from '../../defaults/opacity';

export const Root = styled.div`
  width: 280px;
  height: 56px;
  display: flex;
  position: relative;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.06);
  user-select: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  &:hover .hover-border {
    opacity: 1;
  }
`;

export const HoverBorder = styled.div`
  width: 100%;
  height: 1px;
  position: absolute;
  bottom: 0;
  opacity: 0;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.39);
  transition: 0.1s opacity;
`;

export interface IconProps {
  src: string;
}

export const Icon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-self: center;
  opacity: ${opacity.light.inactiveIcon};

  ${images.center('24px', 'auto')};
  background-image: url(${({ src }: IconProps) => src});
`;

export const LeadingIcon = styled(Icon)`
  margin-left: 12px;
`;

export const TrailingIcon = styled(Icon)`
  margin-right: 12px;
  cursor: pointer;
`;

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;

export interface LabelProps {
  color: string;
  activated: boolean;
}

export const Label = styled.div`
  width: 100%;
  padding-left: 12px;
  position: absolute;
  white-space: nowrap;
  display: flex;
  align-self: center;
  will-change: color, opacity, margin-top, font-size;
  transition: 0.2s color, 0.2s ease-out margin-top, 0.2s ease-out font-size, 0.2s opacity;

  margin-top: ${({ activated }: LabelProps) => (activated ? '-10px' : 'unset')};
  color: ${({ color, activated }) => (activated ? color : '#000')};
  font-size: ${({ activated }) => (activated ? 12 : 16)}px;
  opacity: ${({ activated }) => (activated ? 1 : opacity.light.secondaryText)};

  ${({ activated }) => (activated ? typography.robotoMedium() : typography.robotoRegular())};
`;

export interface InputProps {
  color: string;
}

export const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 8px;
  -webkit-text-fill-color: transparent;
  background-color: transparent;
  font-size: 16px;
  text-shadow: ${`0px 0px 0px rgba(0, 0, 0,${opacity.light.primaryText})`};
  color: ${({ color }: InputProps) => color};
  cursor: pointer;

  ${typography.robotoRegular()};

  &:focus {
    cursor: text;
  }
`;

export interface IndicatorProps {
  color: string;
  activated: boolean;
}

export const Indicator = styled.div`
  height: 2px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: -1px;
  transition: 0.2s ease-out;
  will-change: width;

  width: ${({ activated }: IndicatorProps) => (activated ? 100 : 0)}%;
  background-color: ${({ color }) => color};
`;

export interface HelperTextsProps {
  icon: boolean;
}

export const HelperTexts = styled.div`
  width: 100%;
  position: relative;
  padding-top: 8px;

  padding-left: ${({ icon }: HelperTextsProps) => (icon ? 48 : 12)}px;
`;

export const AssistiveText = styled.div`
  font-size: 12px;

  ${typography.robotoRegular()};
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
`;
