import styled, { css } from 'styled-components';

export const StyledBrowserAction = styled.div`
  position: relative;
`;

interface BadgeProps {
  background?: string;
  color?: string;
}

export const Badge = styled.div`
  position: absolute;
  padding: 1.5px;
  border-radius: 2px;
  border: 1px solid white;
  bottom: 3px;
  pointer-events: none;
  right: 4px;
  z-index: 5;
  font-size: 10px;

  ${({ background, color }: BadgeProps) => css`
    background-color: ${background};
    color: ${color};
  `};
`;
