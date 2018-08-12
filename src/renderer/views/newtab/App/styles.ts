import styled, { css } from 'styled-components';

export const StyledApp = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: white;
  position: absolute;
  top: 0;
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row;
  position: relative;
  padding-top: 24px;
  background-color: #f5f5f5;
  flex-wrap: wrap;

  opacity: ${({ visible }: { visible: boolean }) => (visible ? 1 : 0)};
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
