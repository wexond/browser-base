import * as React from 'react';

import Ripple from '../Ripple';
import { StyledButton, StyledLabel } from './styles';

interface Props {
  background?: string;
  foreground?: string;
  overShadeColor?: string;
  rippleColor?: string;
  children?: any;
}

export const Button = ({
  background,
  foreground,
  overShadeColor,
  rippleColor,
  children,
}: Props) => (
  <StyledButton background={background} overShadeColor={overShadeColor}>
    <StyledLabel foreground={foreground}>{children}</StyledLabel>
    <Ripple color={rippleColor || '#fff'} />
  </StyledButton>
);
