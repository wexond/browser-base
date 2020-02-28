import styled from 'styled-components';

export const StyledNews = styled.div`
  display: grid;
  grid-auto-flow: dense;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, 300px);
  grid-auto-rows: 270px;
  grid-gap: 16px;
  margin-top: 32px;
  margin-bottom: 32px;
`;
