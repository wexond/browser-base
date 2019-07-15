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
  padding: 1px 3px;
  border-radius: 8px;

  top: 6px;
  pointer-events: none;
  right: 4px;
  z-index: 5;
  font-size: 8px;
  ${({ background, color }: BadgeProps) => css`
    background-color: ${background};
    color: ${color};
  `};
`;
