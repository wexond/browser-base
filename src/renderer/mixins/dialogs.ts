import { ITheme } from '~/interfaces';
import styled, { css } from 'styled-components';

export const DIALOG_TRANSITION = `0.2s opacity`;

export const DIALOG_BOX_SHADOW =
  '0 12px 16px rgba(0, 0, 0, 0.12), 0 8px 10px rgba(0, 0, 0, 0.16)';

export const DIALOG_BORDER_RADIUS = '4';

export const DialogBaseStyle = styled.div`
  margin: 16px;
  margin-top: 3px;
  box-shadow: ${DIALOG_BOX_SHADOW};
  border-radius: ${DIALOG_BORDER_RADIUS}px;
  overflow: hidden;
  position: relative;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['dialog.backgroundColor']};
  `}
`;

export const DialogStyle = styled(DialogBaseStyle)`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  animation: 0.15s ease-out 0s 1 fadeIn;
`;

export const PersistentDialogStyle = styled(DialogBaseStyle)`
  ${({
    visible,
    hideTransition,
  }: {
    visible: boolean;
    hideTransition?: boolean;
  }) => css`
    transition: ${!visible && !hideTransition ? 'none' : DIALOG_TRANSITION};
    opacity: ${visible ? 1 : 0};
  `}
`;
