import styled, { css } from 'styled-components';

import { robotoRegular } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';

export const StyledApp = styled.div`
  margin: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  transition: 0.2s opacity, 0.2s margin-top;
  padding: 16px;

  & .textfield,
  .dropdown {
    width: 255px;
    margin-left: auto;
  }

  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    opacity: ${visible ? 1 : 0};
    margin-top: ${visible ? 3 : 10}px;
    background-color: ${theme['dialog.backgroundColor']};
    color: ${theme['dialog.lightForeground'] ? '#fff' : '#000'};
  `}
`;

export const Subtitle = styled.div`
  font-size: 13px;
  opacity: 0.54;
  margin-top: 8px;
`;

export const Title = styled.div`
  font-size: 16px;
  margin-bottom: 16px;
  ${robotoRegular()};
`;

export const Row = styled.div`
  width: 100%;
  height: 48px;
  align-items: center;
  display: flex;
`;

export const Label = styled.div`
  font-size: 12px;
`;

export const Buttons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  & .button:not(:last-child) {
    margin-right: 8px;
  }
`;
