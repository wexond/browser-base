import styled, { css } from 'styled-components';

export const StyledBrowserAction = styled.div`
  position: relative;
  margin-left: 8px;
`;

interface BadgeProps {
  background?: string;
  color?: string;
}

export const Badge = styled.div`
  position: absolute;
  padding: 0 1.5px;
  border-radius: 4px;
  border: 1px solid white;
  bottom: 6px;
  pointer-events: none;
  right: 6px;
  z-index: 5;
  font-size: 10px;
  ${({ background, color }: BadgeProps) => css`
    background-color: ${background};
    color: ${color};
  `};
`;
