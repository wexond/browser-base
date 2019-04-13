import * as React from 'react';
import { StyledBubble, Title, Icon } from './style';

export const Bubble = ({
  children,
  icon,
  invert,
  light,
  maxLines,
  iconSize,
  onClick,
  width,
  disabled,
}: any) => {
  return (
    <StyledBubble
      style={{ minWidth: width, maxWidth: width }}
      disabled={disabled}
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
    </StyledBubble>
  );
};

Bubble.defaultProps = {
  maxLines: 2,
  iconSize: 24,
  width: (800 - 48 - (7 - 1)) / 7,
};
