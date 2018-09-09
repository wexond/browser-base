import styled, { css } from 'styled-components';

import { colors } from '@/constants/renderer';
import { shadows, centerImage, robotoMedium } from '@/mixins';
import { DRAG_ELEMENT_WIDTH } from '@/constants/bookmarks';

export const Root = styled.div`
  width: ${DRAG_ELEMENT_WIDTH}px;
  height: 42px;
  position: fixed;
  transform: translateY(-50%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  z-index: 100;
  pointer-events: none;
  background-color: ${colors.blue['500']};
  box-shadow: ${shadows(6)};
`;

export const IconContainer = styled.div`
  min-width: 24px;
  min-height: 24px;
  margin-left: 8px;
  background-color: #fff;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Icon = styled.div`
  width: 16px;
  height: 16px;

  ${centerImage('16px', '16px')};

  ${({ src }: { src: string }) => css`
    background-image: url(${src});
  `};
`;

export const Title = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  font-size: 13px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${robotoMedium()};
`;
