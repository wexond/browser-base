import styled, { css } from 'styled-components';

import { shadows, centerIcon } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';
import { DIALOG_EASING } from '~/renderer/constants';

export const ContextMenu = styled.div`
  outline: none;
  position: absolute;
  backface-visibility: hidden;
  transform: translateZ(0) scale(1, 1);
  width: 150px;
  cursor: default;
  backdrop-filter: blur(10px);
  z-index: 9999;
  box-shadow: ${shadows(8)};
  border-radius: 4px;

  ${({
    visible,
    theme,
    bigger,
    translucent,
  }: {
    visible: boolean;
    theme?: ITheme;
    bigger?: boolean;
    translucent?: boolean;
  }) => css`
    padding: ${bigger ? 8 : 4}px 0;
    transition: ${visible
      ? `0.35s opacity ${DIALOG_EASING}, 0.35s transform ${DIALOG_EASING}`
      : 'none'};
    opacity: ${visible ? 1 : 0};
    transform: translate3d(0px, ${visible ? 0 : -10}px, 0px);
    pointer-events: ${visible ? 'inherit' : 'none'};
    background-color: ${translucent
      ? theme['dropdown.backgroundColor.translucent']
      : theme['dropdown.backgroundColor']};
  `}
`;

export const ContextMenuSeparator = styled.div`
  height: 1px;
  width: 100%;

  ${({ theme, bigger }: { theme?: ITheme; bigger?: boolean }) => css`
    background-color: ${theme['dropdown.separator.color']};
    margin: ${bigger ? 8 : 4}px 0px;
  `}
`;

export const ContextMenuRow = styled.div`
  margin: 0 20px;
  display: flex;
  align-items: center;
`;

export interface ContextMenuItemProps {
  icon?: string;
  selected?: boolean;
  theme?: ITheme;
  bigger?: boolean;
  visible?: boolean;
  iconSize?: number;
  disabled?: boolean;
}

export const ContextMenuItem = styled.div`
  padding: 12px 24px;
  font-weight: 400;
  position: relative;

  ${({
    icon,
    selected,
    theme,
    bigger,
    visible,
    iconSize,
    disabled,
  }: ContextMenuItemProps) => css`
    pointer-events: ${disabled ? 'none' : 'inherit'};
    opacity: ${disabled ? 0.38 : 1};
    font-size: ${bigger ? 14 : 13}px;
    padding: ${bigger ? 12 : 10}px ${bigger ? 20 : 12}px;
    align-items: center;
    display: ${visible === undefined || visible ? 'flex' : 'none'};
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
      padding-left: ${16 + iconSize + 12}px;
      &:before {
        content: '';
        filter: ${theme['control.lightIcon'] ? 'invert(100%)' : 'none'};
        opacity: 0.54;
        ${centerIcon()};
        width: ${iconSize}px;
        height: ${iconSize}px;
        left: ${16}px;
        position: absolute;
        -webkit-backface-visibility: hidden;
        -webkit-transform: translateZ(0) scale(1.0, 1.0);
        background-image: url(${icon});
      }
    `}
  `}
`;

ContextMenuItem.defaultProps = {
  iconSize: 18,
};
