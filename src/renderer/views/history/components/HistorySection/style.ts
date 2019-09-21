import styled from 'styled-components';

export const EmptySection = styled.div`
  margin-top: 16px;
  padding: 0px 0px 8px 0px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  &:first-child {
    margin-top: 48px;
  }
`;

export const SectionTitle = styled.div`
  font-size: 16px;
  padding: 16px 24px;
  font-weight: 500;
`;
