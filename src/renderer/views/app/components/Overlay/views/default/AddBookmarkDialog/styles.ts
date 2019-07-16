import styled, { css } from 'styled-components';

import { shadows, robotoRegular } from '~/renderer/mixins';

export const StyledDialog = styled.div`
  width: 288px;
  background-color: #fff;
  border-radius: 8px;
  position: absolute;
  top: 42px;
  box-sizing: content-box;
  right: 8px;
  padding: 16px 16px 0px;
  box-shadow: ${shadows(3)};
  
  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `}

  & .textfield, .dropdown {
    width: 100%;
  }
`;

export const Title = styled.div`
  font-size: 16px;
  color: #000;
  padding-bottom: 4px;
  ${robotoRegular()};
`;

export const Row = styled.div`
  width: 100%;
  height: 48px;
  align-items: center;
  display: flex;
`;

export const Label = styled.div`
  font-size: 14px;
  margin-right: 16px;
`;

export const Buttons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8px;
  margin-bottom: 12px;

  & .button:not(:last-child) {
    margin-right: 8px;
  }
`;
