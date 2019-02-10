import styled, { css } from 'styled-components';

import { transparency, colors } from '~/renderer/constants';
import { icons, TABS_PADDING } from '~/renderer/app/constants';
import { centerImage, body2 } from '~/shared/mixins';

interface CloseProps {
  visible: boolean;
}

export const StyledClose = styled.div`
  position: absolute;
  right: 12px;
  height: 16px;
  width: 16px;
  background-image: url('${icons.close}');
  transition: 0.2s opacity, 0.2s filter;
  z-index: 2;
  ${centerImage('100%', '100%')};
  opacity: ${({ visible }: CloseProps) =>
    visible ? transparency.icons.inactive : 0};
`;

interface TabProps {
  selected: boolean;
  isClosing: boolean;
  hovered: boolean;
}

export const StyledTab = styled.div`
  position: absolute;
  height: calc(100% - 6px);
  border-radius: 4px;
  overflow: hidden;
  width: 0;
  left: 0;
  will-change: width;
  display: inline-flex;
  align-items: center;
  -webkit-app-region: no-drag;
  ${({ selected }: TabProps) => css`
    z-index: ${selected ? 2 : 1};
    background-color: ${selected ? 'rgba(33, 150, 243, 0.15)' : 'transparent'};
  `};
  backface-visibility: hidden;
  margin-right: ${TABS_PADDING}px;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: 0.2s opacity;
    background-color: rgba(0, 0, 0, 0.04);
    ${({ hovered, selected }: TabProps) => css`
      background-color: ${selected
        ? 'rgba(33, 150, 243, 0.08)'
        : 'rgba(0, 0, 0, 0.04)'};
      opacity: ${hovered ? 1 : 0};
    `};
  }
`;

interface TitleProps {
  selected: boolean;
  isIcon: boolean;
}

export const StyledTitle = styled.div`
  ${body2()};
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: 0.2s margin-left;
  margin-left: 12px;

  ${({ isIcon, selected }: TitleProps) => css`
    color: ${selected
      ? colors.blue['500']
      : `rgba(0, 0, 0, ${transparency.text.high})`};
    margin-left: ${!isIcon ? 0 : 12}px;
  `};
`;

export const StyledIcon = styled.div`
  height: 16px;
  min-width: 16px;
  transition: 0.2s opacity, 0.2s width;
  ${centerImage('16px', '16px')};
  ${({ isIconSet }: { isIconSet: boolean }) => css`
    min-width: ${isIconSet ? 0 : 16},
    opacity: ${isIconSet ? 0 : 1};
  `};
`;

interface ContentProps {
  collapsed: boolean;
}

export const StyledContent = styled.div`
  position: absolute;
  overflow: hidden;
  z-index: 2;
  display: flex;
  transition: 0.1s max-width;
  margin-left: 16px;
  ${({ collapsed }: ContentProps) => css`
    max-width: calc(100% - ${24 + (collapsed ? 24 : 0)}px);
  `};
`;

export const StyledBorder = styled.div`
  position: absolute;
  width: 1px;
  height: 20px;
  background-color: rgba(0, 0, 0, ${transparency.dividers});
  right: 0px;

  ${({ visible }: { visible: boolean }) => css`
    visibility: ${visible ? 'visible' : 'hidden'};
  `};
`;
