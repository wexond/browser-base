import styled, { css } from 'styled-components';

import { transparency, colors } from '~/shared/constants/renderer';
import { centerImage, robotoRegular } from '@/mixins';
import * as PageItem from '~/shared/components/PageItem';

export const Root = styled(PageItem.PageItem)`
  box-sizing: content-box;
  background-color: #fff;

  &:hover .DELETE-ICON {
    opacity: ${transparency.light.inactiveIcon};
  }
`;

export const Title = styled(PageItem.Title)`
  max-width: calc(100% - 160px);
  padding: 8px;
  margin-left: 12px;
  margin-right: 12px;
  border-radius: 4px;
  will-change: background-color;
  transition: 0.2s background-color;
  cursor: text;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

export const ActionIcon = styled.div`
  width: 32px;
  height: 32px;
  margin-right: 12px;
  z-index: 1;
  opacity: 0;
  margin-left: auto;
  will-change: opacity;
  transition: 0.2s opacity;

  ${centerImage('16px', '16px')};

  &:hover {
    opacity: 1 !important;
  }

  ${({ icon }: { icon: string }) => css`
    background-image: url(${icon});
  `};
`;

export const Input = styled.input`
  width: 100%;
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  margin: 0;
  padding-left: 24px;
  padding-right: 12px;
  -webkit-text-fill-color: transparent;
  background-color: transparent;
  font-size: 16px;
  text-shadow: ${`0px 0px 0px rgba(0, 0, 0,${transparency.light.primaryText})`};
  color: ${colors.blue['500']};
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  background-color: #fff;
  will-change: opacity;
  transition: 0.2s opacity, 0.2s z-index;

  ${robotoRegular()};

  &::placeholder {
    opacity: ${transparency.light.secondaryText};
  }

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'all' : 'none'};
  `};
`;

export interface DividerProps {
  pos: 'top' | 'bottom';
}

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  position: absolute;
  background-color: ${colors.blue['500']};

  ${({ pos }: DividerProps) => css`
    ${pos}: 0;
  `};
`;
