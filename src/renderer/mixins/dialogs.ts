import { ITheme } from '~/interfaces';
import styled, { css } from 'styled-components';

export const DIALOG_TRANSITION = `0.2s opacity`;

export const DIALOG_BOX_SHADOW =
  '0 12px 16px rgba(0, 0, 0, 0.12), 0 8px 10px rgba(0, 0, 0, 0.16)';

export const DIALOG_BORDER_RADIUS = '4';

export const DialogStyle = styled.div`
  margin: 16px;
  margin-top: 3px;
  box-shadow: ${DIALOG_BOX_SHADOW};
  border-radius: ${DIALOG_BORDER_RADIUS}px;
  overflow: hidden;
  position: relative;

  ${({
    visible,
    theme,
    hideTransition,
  }: {
    visible: boolean;
    theme?: ITheme;
    hideTransition?: boolean;
  }) => css`
    transition: ${!visible && !hideTransition ? 'none' : DIALOG_TRANSITION};
    opacity: ${visible ? 1 : 0};
    background-color: ${theme['dialog.backgroundColor']};
  `}
`;
