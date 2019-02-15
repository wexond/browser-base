import styled, { css } from 'styled-components';

export const StyledBottomSheet = styled.div`
  position: absolute;
  top: calc(100% - 275px);
  z-index: 99999;
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  color: black;
`;

export const SmallBar = styled.div`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 20px;
  height: 4px;
  width: 32px;
  background-color: rgba(0, 0, 0, 0.12);
  margin-top: 8px;
`;
