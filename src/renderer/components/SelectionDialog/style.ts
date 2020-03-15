import styled, { css } from 'styled-components';
import { shadows } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';

export const StyledSmallDialog = styled.div`
  width: fit-content;
  position: fixed;
  top: 16px;
  left: ${1024 + 320 + 64 - 16}px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 12px 12px 12px 16px;
  box-shadow: ${shadows(8)};
  will-change: opacity;
  transform: translateX(-100%);
  transition: 0.15s opacity;
  z-index: 999;

  @media all and (max-width: ${1024 + 320 + 64 + 64 + 16}px) {
    left: auto;
    transform: translateX(0);
    right: ${64 + 16 + 16}px;
  }

  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'inherit' : 'none'};
    background-color: ${theme['dialog.backgroundColor']};
  `};
`;

export const Title = styled.div`
  font-size: 12px;
  margin-right: 4px;
`;
