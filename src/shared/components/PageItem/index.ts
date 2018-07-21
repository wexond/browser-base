import styled, { css } from 'styled-components';
import images from '../../mixins/images';
import typography from '../../mixins/typography';
import opacity from '../../defaults/opacity';

const removeIcon = require('../../icons/close.svg');

export const PageItem = styled.div`
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, ${opacity.light.dividers});
  position: relative;

  ${({ selected }: { selected: boolean }) => css`
    background-color: ${selected ? 'rgba(0, 0, 0, 0.08)' : 'transparent'};

    &:hover {
      background-color: ${selected ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.04)'};
    }
  `};

  &:last-child {
    border-bottom: none;
  }
`;

export const PageItemIcon = styled.div`
  height: 16px;
  min-width: 16px;
  margin-left: 24px;
  ${images.center('16px', 'auto')};
`;

export const PageItemRemoveIcon = styled.div`
  position: absolute;
  left: 24px;
  height: 16px;
  min-width: 16px;
  ${images.center('24px', 'auto')};
  background-image: url(${removeIcon});
  z-index: 2;

  &:hover {
    opacity: ${opacity.light.activeIcon};
  }

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? opacity.light.inactiveIcon : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const PageItemPrimaryText = styled.div`
  ${typography.body2()};
  opacity: ${opacity.light.primaryText};
`;

export const PageItemSecondaryText = styled.div`
  ${typography.body2()};
  opacity: ${opacity.light.secondaryText};
`;

export const PageItemTitle = styled(PageItemPrimaryText)`
  margin-left: 48px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 24px;
  ${typography.body2()};
`;

export const PageItemTime = styled(PageItemSecondaryText)`
  margin-left: 24px;
`;
