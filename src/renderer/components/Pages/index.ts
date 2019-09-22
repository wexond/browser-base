import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  overflow: auto;
  height: 100vh;
  overflow: hidden;
`;

export const Content = styled.div`
  height: 100vh;
  flex: 1;
  overflow: auto;
`;

export const LeftContent = styled.div`
  position: relative;
  margin: 64px;
  max-width: 1024px;
`;
