import { shadows, centerImage } from '~/shared/mixins';
import styled, { css } from 'styled-components';

export const ContextMenu = styled.div`
  position: absolute;
  transition: 0.2s opacity, 0.2s margin-top;
  width: 150px;
  cursor: default;
  padding: 8px 0;
  z-index: 9999;
  box-shadow: ${shadows(8)};
  background-color: #303030;
  border-radius: 8px;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
    margin-top: ${visible ? 0 : -20}px;
  `}
`;

export const ContextMenuItem = styled.div`
  padding: 12px 24px;
  font-weight: 400;
  font-size: 14px;

  ${({ icon, selected }: { icon?: string; selected?: boolean }) => css`
    background-color: ${selected ? 'rgba(255, 255, 255, 0.15)' : 'none'};

    &:hover {
      background-color: rgba(255, 255, 255, ${selected ? 0.15 : 0.08});
    }

    ${icon &&
      `
      padding-left: ${24 + 16 + 8}px;
      &:before {
        content: '';
        filter: invert(100%);
        opacity: 0.54;
        ${centerImage('16px', '16px')};
        width: 16px;
        height: 16px;
        left: 16px;
        position: absolute;
        background-image: url(${icon});
      }
    `}
  `}
`;
