import styled from 'styled-components';

import { robotoRegular } from '~/renderer/mixins';

export const StyledList = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px 0px;
  -webkit-app-region: no-drag;
`;

export const Item = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0px 12px;
  font-size: 14px;
  cursor: pointer;
  color: #000;
  ${robotoRegular()};

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;
