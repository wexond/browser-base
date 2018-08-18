import styled, { css } from 'styled-components';

import { colors, transparency } from 'defaults';
import * as PageItem from '../../../components/PageItem';
import { centerImage, robotoRegular } from 'mixins';

export const Title = styled(PageItem.Title)`
  margin-left: 12px;
  margin-right: 12px;
  padding: 8px;
  border-radius: 4px;
  display: table;
  will-change: background-color;
  transition: 0.2s background-color;

  cursor: text;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
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
  top: 0;
  left: 0;
  background-color: #fff;
  opacity: 0;
  will-change: opacity;
  transition: 0.2s opacity, 0.2s z-index;

  ${robotoRegular()};

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    z-index: ${visible ? 2 : -1};
  `};

  &::placeholder {
    opacity: ${transparency.light.secondaryText};
  }
`;

export const ActionIcon = styled.div`
  width: 32px;
  height: 32px;
  ${centerImage('16px', '16px')};

  &:last-child {
    margin-right: 12px;
  }

  &:hover {
    opacity: ${transparency.light.activeIcon};
  }

  ${({ icon, visible }: { icon: string; visible: boolean }) => css`
    background-image: url(${icon});
    opacity: ${visible ? transparency.light.inactiveIcon : 0};
  `};
`;
