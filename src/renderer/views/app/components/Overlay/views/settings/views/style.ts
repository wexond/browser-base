import styled from 'styled-components';

export const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
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
