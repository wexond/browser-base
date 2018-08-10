import styled, { css } from 'styled-components';
import { icons } from '../../../../defaults/icons';
import { centerImage, body2 } from '../../../mixins';
import { opacity } from '../../../../defaults/opacity';
import { colors } from '../../../../defaults/colors';

interface CloseProps {
  hovered: boolean;
  selected: boolean;
}

export const Close = styled.div`
  position: absolute;
  right: 12px;
  height: 16px;
  width: 16px;
  background-image: url(${icons.close});
  transition: 0.2s opacity, 0.2s filter;
  z-index: 2;

  ${centerImage('100%', '100%')};
  opacity: ${({ hovered, selected }: CloseProps) =>
    hovered || selected ? opacity.light.inactiveIcon : 0};
`;

interface TabProps {
  selected: boolean;
  isRemoving: boolean;
  visible: boolean;
  workspaceSelected: boolean;
}

export const StyledTab = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  height: calc(100% - 8px);
  border-radius: 4px;
  overflow: hidden;
  align-items: center;
  transition: 0.2s background-color, 0.1s color;
  will-change: transition, transform, width, left;

  ${({ selected, isRemoving, visible, workspaceSelected }: TabProps) => css`
    z-index: ${selected ? 2 : 1};
    pointer-events: ${isRemoving || !visible ? 'none' : 'auto'};
    -webkit-app-region: ${visible ? 'no-drag' : ''};
    display: ${workspaceSelected ? 'flex' : 'none'};
    background-color: ${selected ? 'rgba(33, 150, 243, 0.12)' : 'transparent'};
  `};
`;

interface OverlayProps {
  hovered: boolean;
  selected: boolean;
}

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  transition: 0.2s opacity;
  background-color: rgba(0, 0, 0, 0.04);

  ${({ selected, hovered }: OverlayProps) => css`
    background-color: ${selected
      ? 'rgba(33, 150, 243, 0.08)'
      : `rgba(0, 0, 0, 0.04)`};
    opacity: ${hovered ? 1 : 0};
  `};
`;

interface TitleProps {
  favicon: string;
  loading: boolean;
  selected: boolean;
}

export const Title = styled.div`
  ${body2()};
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  will-change: color, margin-left;
  transition: 0.2s color, 0.2s margin-left;
  font-weight: 500;
  margin-left: 12px;

  ${({ favicon, loading, selected }: TitleProps) => css`
    color: ${selected
      ? colors.blue['500']
      : `rgba(0, 0, 0, ${opacity.light.secondaryText})`};
    margin-left: ${favicon === '' && !loading ? 0 : 12}px;
  `};
`;

export const Icon = styled.div.attrs({
  style: ({ favicon }: any) => ({
    backgroundImage: `url(${favicon})`,
    opacity: favicon === '' ? 0 : 1,
    minWidth: favicon === '' ? 0 : 16,
  }),
})`
  height: 16px;
  min-width: 16px;
  transition: 0.2s opacity, 0.2s width;
  ${centerImage('16px', '16px')};
  ${({ favicon }: { favicon: string }) => favicon};
`;

interface ContentProps {
  hovered: boolean;
  selected: boolean;
}

export const Content = styled.div`
  position: absolute;
  overflow: hidden;
  z-index: 2;
  display: flex;
  transition: 0.1s max-width, 0.1s transform;
  margin-left: 16px;

  ${({ hovered, selected }: ContentProps) => css`
    max-width: calc(100% - ${24 + (hovered || selected ? 24 : 0)}px);
  `};
`;

export const RightBorder = styled.div`
  height: calc(100% - 16px);
  width: 1px;
  background-color: rgba(0, 0, 0, ${opacity.light.dividers});
  position: absolute;
  right: 0;

  display: ${({ visible }: { visible: boolean }) =>
    visible ? 'block' : 'none'};
`;

export const Circle = styled.div`
  border-radius: 50%;
  width: 24px;
  height: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  transition: 0.2s background-color;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;
