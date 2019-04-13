import styled, { css } from 'styled-components';
import { caption, centerImage } from '~/shared/mixins';

export const StyledBubble = styled.div`
  border-radius: 16px;
  margin-top: 8px;
  padding: 16px;
  transition: 0.1s background-color;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  ${({ disabled }: { disabled: boolean }) => css`
    pointer-events: ${disabled ? 'none' : 'inherit'};
    opacity: ${disabled ? 0.54 : 1};
  `};
`;

export const Icon = styled.div`
  opacity: 1;
  width: 56px;
  height: 56px;
  background-color: #212121;
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
  font-size: 13px;
  text-align: center;
  color: white;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;
