import { ITheme } from '~/interfaces';
import styled, { css } from 'styled-components';

export const DIALOG_TRANSITION = `0.25s opacity, 0.35s transform cubic-bezier(0.1, 0.9, 0.2, 1)`;

export const DIALOG_BOX_SHADOW =
  '0 12px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.16)';

export const DIALOG_BORDER_RADIUS = '4';

export const DialogBaseStyle = styled.div`
  box-shadow: ${DIALOG_BOX_SHADOW};
  border-radius: ${DIALOG_BORDER_RADIUS}px;
  overflow: hidden;
  position: absolute;

  ${({ theme, visible }: { theme?: ITheme; visible?: boolean }) => css`
    background-color: ${theme['dialog.backgroundColor']};
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'inherit' : 'none'};
  `}
`;

export const DialogStyle = styled(DialogBaseStyle)`
  ${({
    visible,
    hideTransition,
  }: {
    visible: boolean;
    hideTransition?: boolean;
  }) => css`
    transition: ${!visible && !hideTransition ? 'none' : DIALOG_TRANSITION};
    transform: ${visible ? `translate3d(0, 0, 0)` : `translate3d(0, -10px, 0)`};
  `}
`;
