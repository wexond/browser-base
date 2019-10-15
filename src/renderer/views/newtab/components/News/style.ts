import styled from 'styled-components';

export const StyledNews = styled.div`
  display: grid;
  grid-auto-flow: row;
  justify-content: center;
  grid-template-columns: repeat(4, 300px);
  grid-auto-rows: 128px;
  grid-gap: 16px;
  margin-top: 32px;
  margin-bottom: 32px;
`;
