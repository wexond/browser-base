import styled, { css } from 'styled-components';
import { shadows } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';
import { DIALOG_BORDER_RADIUS } from '~/renderer/mixins/dialogs';

export const PathView = styled.div`
  margin-top: 48px;
  display: flex;
`;

export const PathItem = styled.div`
  font-size: 20px;
  font-weight: 300;
  opacity: 0.54;
  margin-right: 4px;
  cursor: pointer;
  &:after {
    content: '/';
    margin-left: 4px;
  }
  &:hover {
    opacity: 1;
  }
  &:last-child {
    opacity: 1;
    cursor: default;
    &:after {
      content: '';
      margin-left: 0;
    }
  }
`;

export const Dialog = styled.div`
  position: fixed;
  width: 512px;
  padding: 16px;
  left: 50%;
  top: 50%;
  border-radius: ${DIALOG_BORDER_RADIUS}px;
  z-index: 999;
  box-shadow: ${shadows(8)};
  transition: 0.2s opacity;
  transform: translate(-50%, -50%);

  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'inherit' : 'none'};
    background-color: ${theme['dialog.backgroundColor']};
    color: ${theme['dialog.lightForeground'] ? 'white' : 'black'};
  `}
`;

export const DialogTitle = styled.div`
  font-size: 16px;
  margin-bottom: 16px;
`;

export const DialogButtons = styled.div`
  float: right;
  display: flex;
  margin-top: 24px;
`;
