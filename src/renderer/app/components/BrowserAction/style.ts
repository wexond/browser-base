import styled, { css } from 'styled-components';

import { Theme } from '../../models/theme';

export const StyledBrowserAction = styled.div`
  position: relative;
  margin-left: 8px;
`;

interface BadgeProps {
  background?: string;
  color?: string;
  theme?: Theme;
}

export const Badge = styled.div`
  position: absolute;
  padding: 0 1.5px;
  border-radius: 4px;

  bottom: 6px;
  pointer-events: none;
  right: 6px;
  z-index: 5;
  font-size: 10px;
  ${({ background, color, theme }: BadgeProps) => css`
    background-color: ${background};
    color: ${color};
    border: 1px solid ${theme['toolbar.backgroundColor']};
  `};
`;
