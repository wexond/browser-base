import styled, { css } from 'styled-components';
import { shadows } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';

export const StyledSmallDialog = styled.div`
  width: fit-content;
  height: 68px;
  position: absolute;
  top: 16px;
  right: 16px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0px 16px;
  box-shadow: ${shadows(8)};
  will-change: opacity;
  transition: 0.15s opacity;
  z-index: 999;

  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
    background-color: ${theme['dialog.backgroundColor']};
  `};
`;

export const Title = styled.div`
  font-size: 14px;
`;
