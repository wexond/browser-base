import styled, { css } from 'styled-components';
import { shadows } from '~/shared/mixins';

export const StyledBottomSheet = styled.div`
  position: absolute;
  top: ${({ visible }: { visible: boolean }) =>
    visible ? 'calc(100% - 128px)' : '100%'};
  z-index: 99999;
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  left: 50%;
  transform: translateX(-50%);
  transition: 0.3s top;
  width: 700px;
  color: black;
  box-shadow: ${shadows(4)};
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
