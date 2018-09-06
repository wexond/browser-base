import styled, { css } from 'styled-components';

import { colors, transparency } from '~/shared/constants/renderer';
import * as PageItem from '~/shared/components/PageItem';
import { centerImage, robotoRegular } from '@/mixins';

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
