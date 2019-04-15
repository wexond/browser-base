import * as React from 'react';
import { StyledBubble, Title, Icon } from './style';

export const getSize = (i: number) => {
  const width = 800;
  return (width - 48 - (i - 1)) / i;
};

export const Bubble = ({
  children,
  icon,
  invert,
  light,
  maxLines,
  iconSize,
  onClick,
  itemsPerRow,
  disabled,
}: {
  children?: any;
  icon?: string;
  invert?: boolean;
  maxLines?: number;
  light?: boolean;
  iconSize?: number;
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  itemsPerRow?: number;
  disabled?: boolean;
}) => {
  const width = getSize(itemsPerRow);

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
  itemsPerRow: 7,
};
