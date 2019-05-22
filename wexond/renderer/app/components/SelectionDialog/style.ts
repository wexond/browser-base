import styled, { css } from 'styled-components';
import { shadows } from '~/shared/mixins';
import { Theme } from '../../models/theme';

export const StyledSmallDialog = styled.div`
  width: fit-content;
  height: 68px;
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0px 16px;
  transform: translateX(150px);
  box-shadow: ${shadows(8)};
  will-change: opacity;
  transition: 0.15s opacity;

  ${({ visible, theme }: { visible: boolean; theme?: Theme }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
    background-color: ${theme['overlay.dialog.backgroundColor']};
  `};
`;

export const Title = styled.div`
  font-size: 14px;
`;
