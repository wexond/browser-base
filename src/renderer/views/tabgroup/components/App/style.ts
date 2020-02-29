import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';
import { DialogStyle } from '~/renderer/mixins/dialogs';

export const StyledApp = styled(DialogStyle)`
  margin-top: 10px;
  padding: 16px;
`;

export const Title = styled.div`
  font-size: 16px;
`;

export const Subtitle = styled.div`
  font-size: 13px;
  opacity: 0.54;
  margin-top: 8px;
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: 16px;
  float: right;
`;

export const Colors = styled.div`
  display: flex;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Color = styled.div`
  min-width: 16px;
  height: 16px;
  cursor: pointer;
  border-radius: 16px;
  margin-right: 4px;
  margin-left: 4px;
  margin-top: 8px;
  position: relative;
  overflow: hidden;

  ${({ color }: { color: string }) => css`
    background-color: ${color};
  `}

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    background-color: white;
  }

  &:hover {
    &:after {
      opacity: 0.3;
    }
  }
`;
