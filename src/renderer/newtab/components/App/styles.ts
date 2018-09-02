import styled from 'styled-components';

export const StyledApp = styled.div`
  width: 100%;
  height: 100vh;
  overflow: auto;
  position: absolute;
  top: 0;
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row;
  position: relative;
  padding-top: 24px;
  flex-wrap: wrap;
`;

export const Column = styled.div`
  display: flex;
  flex-flow: column;
  margin-left: 32px;
  align-items: flex-start;

  &:first-child {
    margin-left: 0px;
  }
`;
