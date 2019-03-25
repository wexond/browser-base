import * as React from 'react';
import { StyledMenuItem, Title, Icon } from './style';

export const MenuItem = ({ children, icon }: any) => {
  return (
    <StyledMenuItem>
      <Icon style={{ backgroundImage: `url(${icon})` }} />
      <Title>{children}</Title>
    </StyledMenuItem>
  );
};
