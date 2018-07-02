import styled, { css } from 'styled-components';
import images from '../../mixins/images';
import typography from '../../mixins/typography';
import opacity from '../../defaults/opacity';

const removeIcon = require('../../icons/close.svg');

interface ItemProps {
  selected: boolean;
}

export const PageItem = styled.div`
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: 0.1s all;
  position: relative;

  background-color: ${({ selected }: ItemProps) =>
    (selected ? 'rgba(0, 0, 0, 0.08)' : 'transparent')};

  &:hover {
    background-color: ${({ selected }) =>
    (selected ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.04)')};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const PageItemIcon = styled.div`
  height: 16px;
  min-width: 16px;
  margin-left: 24px;
  ${images.center('16px', 'auto')};
  transition: 0.2s opacity;
`;

interface RemoveIconProps {
  visible: boolean;
}

export const PageItemRemoveIcon = styled.div`
  position: absolute;
  left: 24px;
  height: 16px;
  min-width: 16px;
  ${images.center('24px', 'auto')};
  background-image: url(${removeIcon});
  transition: 0.2s opacity;
  z-index: 2;

  &:hover {
    opacity: ${opacity.light.activeIcon};
  }

  ${({ visible }: RemoveIconProps) => css`
    opacity: ${visible ? opacity.light.inactiveIcon : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const PageItemPrimaryText = styled.div`
  ${typography.robotoRegular()};
  font-size: 14px;
  opacity: ${opacity.light.primaryText};
`;

export const PageItemSecondaryText = styled.div`
  ${typography.robotoRegular()};
  font-size: 14px;
  opacity: ${opacity.light.secondaryText};
`;

export const PageItemTitle = styled(PageItemPrimaryText)`
  margin-left: 48px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 24px;
`;

export const PageItemTime = styled(PageItemSecondaryText)`
  margin-left: 24px;
`;
