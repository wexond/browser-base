import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';
import {
  DIALOG_BOX_SHADOW,
  DIALOG_BORDER_RADIUS,
} from '~/renderer/mixins/dialogs';

export const StyledApp = styled.div`
  margin: 16px;
  padding: 16px;
  box-shadow: ${DIALOG_BOX_SHADOW};
  border-radius: ${DIALOG_BORDER_RADIUS}px;
  overflow: hidden;
  position: relative;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['dialog.backgroundColor']};
    color: ${theme['dialog.lightForeground'] ? 'white' : 'black'};
  `}
`;

export const Title = styled.div`
  font-size: 16px;
  font-weight: 300;
`;

export const Permissions = styled.div`
  margin-top: 12px;
`;

export const Permission = styled.div`
  font-size: 13px;
  margin-top: 8px;
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: 16px;
  float: right;
`;
