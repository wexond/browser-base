import styled from 'styled-components';

import { robotoRegular, noButtons } from '~/renderer/mixins';

export const StyledList = styled.div`
  width: 100%;
  max-height: calc(100vh - 16px);
  padding: 8px 0px;
  overflow: hidden auto;
  ${noButtons()};
`;

export const StyledItem = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const Label = styled.div`
  padding: 0px 12px;
  font-size: 14px;
  pointer-events: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #000;
  ${robotoRegular()};
`;
