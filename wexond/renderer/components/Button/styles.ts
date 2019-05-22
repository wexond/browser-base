import styled, { css } from 'styled-components';

import { shadows, button } from '~/shared/mixins';

interface StyledButtonProps {
  background: string;
  foreground: string;
  type?: 'contained' | 'outlined';
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

  ${({ background, foreground, type }: StyledButtonProps) => css`
    color: ${foreground || '#fff'};
    border: ${type === 'outlined'
      ? `1px solid ${background || '#2196F3'}`
      : 'unset'};
    background-color: ${type === 'outlined'
      ? 'transparent'
      : background || '#2196F3'};

    &::before {
      background-color: ${foreground || '#fff'};
    }
  `};
`;

export const StyledLabel = styled.div`
  z-index: 1;
  ${button()};
`;
