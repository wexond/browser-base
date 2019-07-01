import styled from 'styled-components';

import { Content } from '../../../style';

export const Section = styled(Content)`
  padding-left: 32px;
`

export const Title = styled.div`
  font-size: 16px;
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
`
