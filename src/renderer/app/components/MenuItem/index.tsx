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
  width,
}: any) => {
  return (
    <StyledMenuItem
      style={{ minWidth: width, maxWidth: width }}
      onClick={onClick}
    >
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
  iconSize: 24,
  width: (800 - 48 - (7 - 1)) / 7,
};
