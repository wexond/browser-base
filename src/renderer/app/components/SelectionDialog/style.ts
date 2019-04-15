import styled, { css } from 'styled-components';
import { shadows } from '~/shared/mixins';

export const StyledSmallDialog = styled.div`
  width: fit-content;
  height: 68px;
  background-color: #303030;
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

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const Title = styled.div`
  font-size: 14px;
`;
