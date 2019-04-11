import * as React from 'react';

import Ripple from '../Ripple';
import { StyledButton, StyledLabel } from './styles';

interface Props {
  background?: string;
  foreground?: string;
  overShadeColor?: string;
  children?: any;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: any;
}

export const Button = ({
  background,
  foreground,
  overShadeColor,
  onClick,
  children,
  style,
}: Props) => (
  <StyledButton
    background={background}
    overShadeColor={overShadeColor}
    onClick={onClick}
    style={style}
  >
    <StyledLabel foreground={foreground}>{children}</StyledLabel>
    <Ripple color={foreground || '#fff'} />
  </StyledButton>
);
