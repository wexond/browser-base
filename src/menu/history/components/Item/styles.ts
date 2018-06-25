import styled, { css } from 'styled-components';
import images from '../../../../shared/mixins/images';
import typography from '../../../../shared/mixins/typography';
import opacity from '../../../../shared/defaults/opacity';

const removeIcon = require('../../../../shared/icons/close.svg');

interface StyledItemProps {
  selected: boolean;
}

export const StyledItem = styled.div`
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  background-color: ${({ selected }: StyledItemProps) =>
    (selected ? 'rgba(0, 0, 0, 0.08)' : 'transparent')};

  &:hover {
    background-color: ${({ selected }) =>
    (selected ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.03)')};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const Icon = styled.div`
  height: 16px;
  min-width: 16px;
  margin-left: 24px;
  ${images.center('16px', 'auto')};
  transition: 0.2s opacity;
`;

interface RemoveIconProps {
  visible: boolean;
}

export const RemoveIcon = styled.div`
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

export const PrimaryText = styled.div`
  ${typography.robotoRegular()};
  font-size: 14px;
  opacity: ${opacity.light.primaryText};
`;

export const SecondaryText = styled.div`
  ${typography.robotoRegular()};
  font-size: 14px;
  opacity: ${opacity.light.secondaryText};
`;

export const Title = styled(PrimaryText)`
  margin-left: 48px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 24px;
`;

export const Time = styled(SecondaryText)`
  margin-left: 24px;
`;
