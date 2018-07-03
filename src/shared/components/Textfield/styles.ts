import styled from 'styled-components';

import typography from '../../mixins/typography';
import opacity from '../../defaults/opacity';

export const Root = styled.div`
  width: 280px;
  height: 56px;
  position: relative;
  cursor: text;
  background-color: rgba(0, 0, 0, 0.06);
  user-select: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  flex-wrap: wrap;

  //border-bottom: 1px solid rgba(0, 0, 0, 0.39);
`;

export interface LabelProps {
  color: string;
  focused: boolean;
}

export const Label = styled.div`
  position: absolute;
  left: 12px;
  display: flex;
  align-self: center;
  will-change: margin-top, font-size;
  transition: 0.2s color, 0.2s ease-out margin-top, 0.2s ease-out font-size, 0.2s opacity;

  color: ${({ color, focused }) => (focused ? color : '#000')};
  margin-top: ${({ focused }: LabelProps) => (focused ? '-12px' : 'unset')};
  font-size: ${({ focused }) => (focused ? 12 : 16)}px;
  opacity: ${({ focused }) => (focused ? 1 : opacity.light.secondaryText)};

  ${({ focused }) => (focused ? typography.robotoMedium() : typography.robotoRegular())};
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
  padding-top: 8px;
  -webkit-text-fill-color: transparent;
  background-color: transparent;
  font-size: 16px;
  text-shadow: ${`0px 0px 0px rgba(0, 0, 0,${opacity.light.primaryText})`};
  color: ${({ color }: InputProps) => color};

  ${typography.robotoRegular()};
`;

export interface IndicatorProps {
  color: string;
  focused: boolean;
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

  width: ${({ focused }: IndicatorProps) => (focused ? 100 : 0)}%;
  background-color: ${({ color }) => color};
`;
