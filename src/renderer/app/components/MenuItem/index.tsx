import * as React from 'react';
import { StyledMenuItem, Title, Icon } from './style';

export const MenuItem = ({ children }: any) => {
  return (
    <StyledMenuItem>
      <Icon />
      <Title>{children}</Title>
    </StyledMenuItem>
  );
};
