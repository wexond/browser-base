import styled, { css } from 'styled-components';

import { shadows, robotoRegular } from '~/renderer/mixins';
import { EASING_FUNCTION } from '~/renderer/constants';
import { ITheme } from '~/interfaces';

export const StyledDialog = styled.div`
  width: 288px;
  background-color: #fff;
  border-radius: 8px;
  position: absolute;
  top: 42px;
  box-sizing: content-box;
  right: 8px;
  padding: 16px 16px 0px;
  box-shadow: ${shadows(3)};
  transition: 0.15s opacity, 0.15s margin-top ${EASING_FUNCTION};

  ${({ visible, theme }: { visible: boolean, theme: ITheme }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
    margin-top: ${visible ? 0 : -16}px;
    background-color: ${theme['overlay.dialog.backgroundColor']};
  `}

  & .textfield, .dropdown {
    width: 232px;
    margin-left: auto;
  }
`;

export const Title = styled.div`
  font-size: 16px;
  padding-bottom: 4px;
  ${robotoRegular()};

  ${({ theme }: { theme: ITheme }) => css`
    color: ${theme['overlay.foreground'] === 'light' ? '#fff' : '#000'};
  `}
`;

export const Row = styled.div`
  width: 100%;
  height: 48px;
  align-items: center;
  display: flex;
`;

export const Label = styled.div`
  font-size: 14px;
`;

export const Buttons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8px;
  margin-bottom: 12px;

  & .button:not(:last-child) {
    margin-right: 8px;
  }
`;
