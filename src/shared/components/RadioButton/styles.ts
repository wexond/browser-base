import styled from 'styled-components';
import { UITheme, Align } from '../../enums';
import Positioning from '../../mixins/positioning';
import {
  getComponentColor,
  getComponentForeground
} from '../../utils/component-color';
import typography from '../../mixins/typography';
import Cursors from '../../mixins/cursors';

export interface IContainerProps {
  disabled?: boolean;
}

export interface IStyledRadioButtonProps {
  scaleAnimation: boolean;
}

export interface IBorderProps {
  borderWidth: number;
  animations: boolean;
  color: string;
  toggled: boolean;
  disabled: boolean;
  theme: UITheme;
}

export interface ICircleProps {
  size: number;
  visible: boolean;
  color: string;
  toggled: boolean;
  disabled: boolean;
  theme: UITheme;
}

export interface ITextProps {
  disabled: boolean;
  theme: UITheme;
}

const getBackground = (
  color: string,
  toggled: boolean,
  disabled: boolean,
  theme: UITheme
) => getComponentColor(color, toggled, disabled, theme);

export const StyledRadioButton = styled.div`
  width: 18px;
  height: 18px;
  position: relative;
  transition: 0.2s transform ease-out;

  transform: ${(props: IStyledRadioButtonProps) =>
    !props.scaleAnimation ? 'scale(1)' : 'scale(0.9)'};
`;

export const Border = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  border-style: solid;
  box-sizing: border-box;

  border-width: ${(props: IBorderProps) => props.borderWidth}px;
  border-color: ${props =>
    getBackground(props.color, props.toggled, props.disabled, props.theme)};
  transition: ${props =>
    props.animations ? '0.1s border-color, 0.3s border-width ease-out' : ''};
`;

export const Circle = styled.div`
  position: absolute;
  position: relative;
  border-radius: 100%;
  transition: 0.1s background-color, 0.2s width ease-out, 0.2s height ease-out;

  width: ${(props: ICircleProps) => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props =>
    getBackground(props.color, props.toggled, props.disabled, props.theme)};
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  ${Positioning.center(Align.CenterBoth)};
`;

export const Container = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  -webkit-font-smoothing: antialiased;

  ${(props: IContainerProps) => props.disabled && 'pointer-events: none;'};
  ${Cursors.pointer()};
`;

export const ComponentText = styled.div`
  margin-left: 8px;
  margin-right: 24px;
  font-size: 15px;
  opacity: ${(props: ITextProps) => 1};
  color: ${props => getComponentForeground(props.disabled, props.theme)};
  ${typography.body2()};
`;
