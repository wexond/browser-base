import styled from 'styled-components';
import { caption, centerImage } from '~/shared/mixins';

const width = 700;
const itemsPerRow = 5;
const size = (width - 48 - (itemsPerRow - 1) * 16) / itemsPerRow;

export const StyledMenuItem = styled.div`
  border-radius: 8px;
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
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

export const Icon = styled.div`
  opacity: 0.54;
  width: 42px;
  height: 42px;
  margin-bottom: 16px;
  ${centerImage('42px', '42px')};
`;

export const Title = styled.div`
  ${caption()};
  text-align: center;
`;
