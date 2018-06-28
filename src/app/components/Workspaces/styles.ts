import styled from 'styled-components';

export const Root = styled.div`
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 100;
  display: flex;
  display: none;

  background-color: rgba(0, 0, 0, 0.79);
`;

export const ItemsContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-self: center;
`;
