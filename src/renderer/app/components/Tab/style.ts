import styled, { css } from 'styled-components';

import { transparency, colors } from '~/renderer/constants';
import { icons } from '~/renderer/app/constants';
import { centerImage, body2 } from '~/shared/mixins';

interface CloseProps {
  hovered: boolean;
  selected: boolean;
}

export const Close = styled.div`
  position: absolute;
  right: 12px;
  height: 16px;
  width: 16px;
  background-image: url('${icons.close}');
  transition: 0.2s opacity, 0.2s filter;
  z-index: 2;
  ${centerImage('100%', '100%')};
  opacity: ${({ hovered, selected }: CloseProps) =>
    hovered || selected ? transparency.icons.inactive : 0};
`;

interface TabProps {
  selected: boolean;
  isClosing: boolean;
  hovered: boolean;
  borderVisible: boolean;
}

export const StyledTab = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  height: calc(100% - 6px);
  border-radius: 4px;
  overflow: hidden;
  align-items: center;
  -webkit-app-region: no-drag;
  ${({ selected }: TabProps) => css`
    z-index: ${selected ? 2 : 1};
    background-color: ${selected ? 'rgba(33, 150, 243, 0.15)' : 'transparent'};
  `};
  backface-visibility: hidden;

  &:before {
    content: '';
    position: absolute;
    width: 1px;
    height: 20px;
    background-color: rgba(0, 0, 0, ${transparency.dividers});
    right: 0px;
    ${({ borderVisible }: TabProps) => css`
      visibility: ${borderVisible ? 'visible' : 'hidden'};
    `};
  }
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
  transition: 0.2s margin-left;
  margin-left: 12px;

  ${({ favicon, loading, selected }: TitleProps) => css`
    color: ${selected
      ? colors.blue['500']
      : `rgba(0, 0, 0, ${transparency.text.high})`};
    margin-left: ${favicon === '' && !loading ? 0 : 12}px;
  `};
`;

export const Icon = styled.div`
  height: 16px;
  min-width: 16px;
  transition: 0.2s opacity, 0.2s width;
  ${centerImage('16px', '16px')};
  ${({ favicon }: { favicon: string }) => css`
    background-image: url(${favicon});
    min-width: ${favicon === '' ? 0 : 16},
    opacity: ${favicon === '' ? 0 : 1};
  `};
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
  transition: 0.1s max-width;
  margin-left: 16px;
  ${({ hovered, selected }: ContentProps) => css`
    max-width: calc(100% - ${24 + (hovered || selected ? 24 : 0)}px);
  `};
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
