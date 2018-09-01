import styled, { css } from 'styled-components';

import { colors, transparency } from '~/renderer/defaults';
import { robotoMedium } from '@mixins';

export const StyledItem = styled.div`
  width: calc(100% - 16px);
  height: 48px;
  padding-right: 16px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &::before {
    content: '';
    width: calc(100% - 16px);
    height: calc(100% - 8px);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.15;
  }

  ${({ selected }: { selected: boolean }) => css`
    pointer-events: ${selected ? 'none' : 'auto'};

    &::before {
      background-color: ${selected ? colors.blue['500'] : 'unset'};
    }
  `};
`;

interface IconProps {
  src: string;
  selected: boolean;
}

export const Icon = styled.div`
  height: 24px;
  width: 24px;
  margin-left: 16px;

  ${({ selected, src }: IconProps) => css`
    opacity: ${selected ? 1 : 0.5};
    mask-image: url(${src});
    background-color: ${selected ? colors.blue['500'] : '#000'};
  `};
`;

export const Title = styled.div`
  font-size: 14px;
  margin-left: 32px;

  ${robotoMedium()};

  ${({ selected }: { selected: boolean }) => css`
    color: ${selected ? colors.blue['500'] : '#000'};
    opacity: ${selected ? 1 : transparency.light.primaryText};
  `};
`;
