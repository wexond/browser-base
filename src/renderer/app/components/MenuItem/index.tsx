import * as React from 'react';
import { StyledMenuItem, Title, Icon } from './style';

export const MenuItem = ({
  children,
  icon,
  invert,
  light,
  maxLines,
  iconSize,
  onClick,
}: any) => {
  return (
    <StyledMenuItem onClick={onClick}>
      <Icon
        invert={invert}
        light={light}
        style={{
          backgroundImage: `url(${icon})`,
          backgroundSize: `${iconSize}px`,
        }}
      />
      <Title
        style={{
          WebkitLineClamp: maxLines,
        }}
      >
        {children}
      </Title>
    </StyledMenuItem>
  );
};

MenuItem.defaultProps = {
  maxLines: 2,
  iconSize: 32,
};
