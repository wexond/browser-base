import styled from 'styled-components';

export const StyledApp = styled.div`
  width: 100%;
  height: 100vh;
  overflow: auto;
  position: absolute;
  top: 0;
`;

export const PageContainer = styled.div`
  width: calc(100% - 256px);
  height: 100vh;
  margin-left: 256px;
  position: relative;
`;

export const Content = styled.div`
  width: calc(100% - 64px);
  max-width: 640px;
  margin: 0 auto;
  padding-bottom: 32px;
`;
