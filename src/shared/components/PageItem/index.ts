import styled, { css } from 'styled-components';

import { transparency } from '@/constants/renderer';
import { body2, centerImage } from '@/mixins';

export const PageItem = styled.div`
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, ${transparency.light.dividers});
  position: relative;
  cursor: pointer;
  user-select: auto;

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
  color: rgba(0, 0, 0, ${transparency.light.primaryText});
  ${body2()};
`;

export const SecondaryText = styled.div`
  color: rgba(0, 0, 0, ${transparency.light.secondaryText});
  ${body2()};
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
