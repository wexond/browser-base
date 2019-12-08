import styled, { css } from 'styled-components';

import { shadows, centerIcon } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';

export const ContextMenu = styled.div`
  position: absolute;
  transition: 0.2s opacity, 0.2s margin-top;
  width: 150px;
  cursor: default;
  padding: 8px 0;
  z-index: 9999;
  box-shadow: ${shadows(8)};
  border-radius: 4px;

  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
    background-color: ${theme['dropdown.backgroundColor']};
    margin-top: ${visible ? 0 : -20}px;
  `}
`;

export interface ContextMenuItemProps {
  icon?: string;
  selected?: boolean;
  theme?: ITheme;
  dense?: boolean;
  visible?: boolean;
}

export const ContextMenuItem = styled.div`
  padding: 12px 24px;
  font-weight: 400;

  ${({ icon, selected, theme, dense, visible }: ContextMenuItemProps) => css`
    font-size: ${dense ? 13 : 14}px;
    padding: ${dense ? 8 : 12}px ${dense ? 12 : 24}px;
    display: ${visible === undefined || visible ? 'block' : 'none'};
    background-color: ${selected
      ? theme['control.lightIcon']
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.1)'
      : 'none'};

    &:hover {
      background-color: ${theme['control.lightIcon']
        ? `rgba(255, 255, 255, ${selected ? 0.15 : 0.08})`
        : `rgba(0, 0, 0, ${selected ? 0.1 : 0.06})`};
    }

    ${icon &&
      `
      padding-left: ${24 + 16 + 8}px;
      &:before {
        content: '';
        filter: ${theme['control.lightIcon'] ? 'invert(100%)' : 'none'};
        opacity: 0.54;
        ${centerIcon()};
        width: 16px;
        height: 16px;
        left: 16px;
        position: absolute;
        background-image: url(${icon});
      }
    `}
  `}
`;
