import styled, { css } from 'styled-components';
import colors from '../../../../shared/defaults/colors';
import typography from '../../../../shared/mixins/typography';
import opacity from '../../../../shared/defaults/opacity';

export const StyledItem = styled.div`
  height: 48px;
  position: relative;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  width: 100%;
  padding-right: 16px;
  display: flex;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  ${({ selected }: { selected: boolean }) => css`
    pointer-events: ${selected ? 'none' : 'auto'};
  `};
`;

interface IconProps {
  image: string;
  subItem: boolean;
  selected: boolean;
}

export const Icon = styled.div`
  height: 24px;
  width: 24px;

  ${({ subItem, selected, image }: IconProps) => css`
    margin-left: ${subItem ? '40px' : '16px'};
    background-color: ${selected ? colors.blue['500'] : '#000'};
    mask-image: url(${image});
    opacity: ${selected ? 1 : 0.5};
  `};
`;

export const Title = styled.div`
  font-size: 14px;
  margin-left: 32px;

  ${typography.robotoMedium()};
  display: 'flex';

  ${({ selected }: { selected: boolean }) => css`
    color: ${selected ? colors.blue['500'] : '#000'};
    opacity: ${selected ? 1 : opacity.light.primaryText};
  `};
`;

export const Background = styled.div`
  opacity: 0.15;
  position: absolute;
  width: calc(100% - 16px);
  border-radius: 4px;
  left: 50%;
  top: 50%;
  height: calc(100% - 8px);
  transform: translate(-50%, -50%);

  ${({ selected }: { selected: boolean }) => css`
    background: ${selected ? colors.blue['500'] : 'none'};
  `};
`;

export const SubItemsContainer = styled.div`
  overflow: hidden;
  transition: 0.2s height;
  will-change: transition, height;
`;
