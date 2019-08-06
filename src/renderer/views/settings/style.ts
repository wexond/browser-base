import styled from 'styled-components';

import { robotoMedium, robotoLight } from '~/renderer/mixins';

export const Sections = styled.div`
  width: calc(100% - 300px);
  margin-left: 300px;
  display: flex;
  align-items: center;
  flex-flow: column;
`;

export const Title = styled.div`
  font-size: 14px;
  ${robotoMedium()};
`;

export const Header = styled.div`
  margin-top: 4px;
  font-size: 20px;
  ${robotoLight()};
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-top: 24px;
  }
`;

export const Control = styled.div`
  margin-left: auto;
`;
