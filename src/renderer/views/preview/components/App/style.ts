import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';
import { maxLines } from '~/renderer/mixins';
import { TAB_MAX_WIDTH } from '~/renderer/views/app/constants/tabs';
import { PersistentDialogStyle } from '~/renderer/mixins/dialogs';

export const StyledApp = styled(PersistentDialogStyle)`
  margin: 0;
  padding: 12px;
  font-size: 13px;
  max-width: ${TAB_MAX_WIDTH}px;

  ${({ theme, xTransition }: { theme?: ITheme; xTransition: boolean }) => css`
    color: ${theme['dialog.textColor']};
    transition: 0.15s opacity ${xTransition ? ', 0.08s transform' : ''};
  `}
`;

export const Title = styled.div`
  font-weight: 500;
  line-height: 1.3rem;
  ${maxLines(2)};
  opacity: 0.87;
`;

export const Domain = styled.div`
  opacity: 0.7;
  line-height: 1.3rem;
`;

export const Subtitle = styled.div`
  font-size: 13px;
  opacity: 0.54;
  margin-top: 8px;
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: 16px;
  float: right;
`;
