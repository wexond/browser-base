import styled from 'styled-components';

export const StyledApp = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  display: flex;
  top: 0;
`;

export const PageContainer = styled.div`
  width: calc(100% - 256px);
  margin-left: 256px;
  position: relative;
`;

export const Content = styled.div`
  width: calc(100% - 64px);
  max-width: 640px;
  margin: 24px auto;
  overflow: hidden;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08),
    0 1px 3px 1px rgba(60, 64, 67, 0.16);
`;
