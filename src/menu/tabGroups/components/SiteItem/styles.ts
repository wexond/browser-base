import styled from 'styled-components';

export const StyledSiteItem = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  display: flex;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const Icon = styled.div`
  width: 16px;
  height: 16px;
  background-color: black;
  margin-left: 24px;
`;

export const Title = styled.div`
  font-size: 14px;
  margin-left: 24px;
`;
