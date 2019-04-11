import styled, { css } from 'styled-components';

import { shadows, button } from '~/shared/mixins';

interface StyledButtonProps {
  background: string;
  overShadeColor: string;
}

export const StyledButton = styled.div`
  min-width: 88px;
  width: fit-content;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  box-shadow: ${shadows(2)};

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0;
    position: absolute;
    will-change: opacity;
    transition: 0.2s opacity;
  }

  &:hover::before {
    opacity: 0.12;
  }

  &:active {
    box-shadow: ${shadows(4)};
  }

  ${({ background, overShadeColor }: StyledButtonProps) => css`
    background-color: ${background || '#2196F3'};

    &::before {
      background-color: ${overShadeColor || '#fff'};
    }
  `};
`;

export const StyledLabel = styled.div`
  z-index: 1;
  ${button()};

  ${({ foreground }: { foreground: string }) => css`
    color: ${foreground || '#fff'};
  `};
`;
