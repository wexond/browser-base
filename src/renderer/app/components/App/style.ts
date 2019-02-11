import styled, { css } from 'styled-components';
import { transparency } from '~/renderer/constants';

export const Line = styled.div`
  background-color: rgba(0, 0, 0, ${transparency.dividers});
  height: 1px;
  width: 100%;
`;

export const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  transition: 0.2s opacity;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;
