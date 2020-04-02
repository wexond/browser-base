import * as React from 'react';

import { StyledButton, StyledLabel } from './styles';

interface Props {
  background?: string;
  foreground?: string;
  type?: 'contained' | 'outlined';
  children?: any;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: any;
}

export const Button = ({
  background,
  foreground,
  type,
  onClick,
  children,
  style,
}: Props) => (
  <StyledButton
    className="button"
    background={background}
    foreground={foreground}
    type={type}
    onClick={onClick}
    style={style}
  >
    <StyledLabel>{children}</StyledLabel>
  </StyledButton>
);
