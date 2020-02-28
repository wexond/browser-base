import { DIALOG_EASING } from '../constants';
import { ITheme } from '~/interfaces';
import styled, { css } from 'styled-components';

export const DIALOG_TRANSITION = `0.35s opacity ${DIALOG_EASING}, 0.35s transform ${DIALOG_EASING}`;

export const DialogStyle = styled.div`
  margin: 8px;
  margin-top: 3px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  transition: ${DIALOG_TRANSITION};

  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    opacity: ${visible ? 1 : 0};
    transform: translateY(${visible ? 0 : -10}px);
    background-color: ${theme['dialog.backgroundColor']};
  `}
`;
