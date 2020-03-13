import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';
import { DIALOG_BOX_SHADOW } from '~/renderer/mixins/dialogs';

export const StyledApp = styled.div`
  margin: 8px;
  padding: 16px;
  box-shadow: ${DIALOG_BOX_SHADOW};
  border-radius: 6px;
  overflow: hidden;
  position: relative;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['dialog.backgroundColor']};
    color: ${theme['dialog.lightForeground'] ? 'white' : 'black'};
  `}
`;

export const Title = styled.div`
  font-size: 16px;
`;

export const Subtitle = styled.div`
  font-size: 13px;
  opacity: 0.54;
  margin-top: 8px;
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: 24px;
  float: right;
`;
