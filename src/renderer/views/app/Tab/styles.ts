import styled, { css } from 'styled-components';
import images from '../../../shared/mixins/images';
import opacity from '../../../shared/defaults/opacity';
import colors from '../../../shared/defaults/colors';
import typography from '../../../shared/mixins/typography';

const closeIcon = require('../../../shared/icons/close.svg');

export const Close = styled.div`
  position: absolute;
  right: 12px;
  height: 16px;
  width: 16px;
  background-image: url(${closeIcon});
  transition: 0.2s opacity, 0.2s filter;
  z-index: 2;

  ${images.center('100%', '100%')};
  opacity: ${({ hovered }: { hovered: boolean }) => (hovered ? opacity.light.inactiveIcon : 0)};
`;

interface TabProps {
  selected: boolean;
  isRemoving: boolean;
  visible: boolean;
}

export const StyledTab = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  height: 100%;
  align-items: center;
  transition: 0.2s background-color, 0.1s color;
  will-change: transition, transform, width, left;

  ${({ selected, isRemoving, visible }: TabProps) => css`
    z-index: ${selected ? 2 : 1};
    pointer-events: ${isRemoving || !visible ? 'none' : 'auto'};
    -webkit-app-region: ${visible ? 'no-drag' : ''};
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

  opacity: ${({ selected, hovered }: OverlayProps) => {
    if (selected) {
      if (hovered) {
        return 1;
      }
      return 0;
    }
    if (hovered) {
      return 1;
    }
    return 0;
  }};
`;

interface TitleProps {
  favicon: string;
  loading: boolean;
  selected: boolean;
}

export const Title = styled.div`
  ${typography.body2()};
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  will-change: color, margin-left;
  transition: 0.2s color, 0.2s margin-left;
  font-weight: 500;
  margin-left: 12px;

  ${({ favicon, loading, selected }: TitleProps) => css`
    color: ${selected ? colors.blue['500'] : `rgba(0, 0, 0, ${opacity.light.secondaryText})`};
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
  ${images.center('16px', '16px')};
  ${({ favicon }: { favicon: string }) => favicon};
`;

export const Content = styled.div`
  position: absolute;
  overflow: hidden;
  z-index: 2;
  display: flex;
  transition: 0.1s max-width, 0.1s transform;

  ${({ hovered }: { hovered: boolean }) => {
    let transform = 'transform: translateX(-50%);';
    if (hovered) {
      transform = 'transform: translateX(calc(-50% - 12px));';
    }
    return css`
      ${transform};
      left: 50%;
      max-width: calc(100% - ${24 + (hovered ? 24 : 0)}px);
    `;
  }};
`;

export const RightBorder = styled.div`
  height: calc(100% - 24px);
  width: 1px;
  background-color: rgba(0, 0, 0, ${opacity.light.dividers});
  position: absolute;
  right: 0;

  display: ${({ visible }: { visible: boolean }) => (visible ? 'block' : 'none')};
`;
