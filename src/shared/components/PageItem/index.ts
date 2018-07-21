import styled, { css } from 'styled-components';
import images from '../../mixins/images';
import typography from '../../mixins/typography';
import opacity from '../../defaults/opacity';

export const PageItem = styled.div`
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, ${opacity.light.dividers});
  position: relative;
  cursor: pointer;

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

  ${({ icon }: { icon: string }) => css`
    background-image: url(${icon});
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
