import styled, { css } from 'styled-components';
import { icons, opacity } from '../../../defaults';
import { body2, centerImage } from '../../mixins';

export const Root = styled.div`
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
      background-color: ${selected
        ? 'rgba(0, 0, 0, 0.1)'
        : 'rgba(0, 0, 0, 0.04)'};
    }
  `};

  &:last-child {
    border-bottom: none;
  }
`;

export const Icon = styled.div`
  height: 16px;
  min-width: 16px;
  margin-left: 24px;
  ${centerImage('16px', 'auto')};

  ${({ icon }: { icon: string }) => css`
    background-image: url(${icon});
  `};
`;

export const PrimaryText = styled.div`
  opacity: ${opacity.light.primaryText};

  ${body2()};
`;

export const SecondaryText = styled.div`
  opacity: ${opacity.light.secondaryText};

  ${body2()};
`;

export const Title = styled(PrimaryText)`
  margin-left: 48px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 24px;

  ${body2()};
`;

export const Time = styled(SecondaryText)`
  margin-left: 24px;
`;

export const RemoveIcon = styled.div`
  position: absolute;
  left: 24px;
  height: 16px;
  width: 16px;
  z-index: 2;
  background-image: url(${icons.close});

  ${centerImage('24px', 'auto')};

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? opacity.light.inactiveIcon : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};

  &:hover {
    opacity: ${opacity.light.activeIcon};
  }
`;
