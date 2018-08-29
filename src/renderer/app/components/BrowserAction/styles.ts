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
  border-radius: 4px;
  border: 1px solid white;
  bottom: 4px;
  pointer-events: none;
  right: 4px;
  z-index: 5;
  font-size: 8px;

  ${({ background, color }: BadgeProps) => css`
    background-color: ${background};
    color: ${color};
  `};
`;
