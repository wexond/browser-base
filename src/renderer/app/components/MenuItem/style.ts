import styled, { css } from 'styled-components';
import { caption, centerImage } from '~/shared/mixins';

const width = 800;
const itemsPerRow = 5;
const size = (width - 48 - (itemsPerRow - 1) * 16) / itemsPerRow;

export const StyledMenuItem = styled.div`
  border-radius: 16px;
  min-width: ${size}px;
  max-width: ${size}px;
  height: ${size}px;
  margin-left: 16px;
  margin-top: 16px;
  transition: 0.1s background-color;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

export const Icon = styled.div`
  opacity: 1;
  width: 64px;
  height: 64px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  margin-bottom: 16px;
  ${centerImage('32px', '32px')};

  ${({ invert, light }: { invert: boolean; light: boolean }) => css`
    filter: ${invert ? 'invert(100%)' : 'none'};
    background-color: ${light
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.2)'};
  `}
`;

export const Title = styled.div`
  font-size: 14px;
  text-align: center;
  color: white;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;
