import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-image: url(https://i.ytimg.com/vi/lbnMmJQ7XpE/maxresdefault.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 300px;
`;

export const Content = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: calc(100% - 64px);
  margin: 0 auto;
  max-width: 1366px;
`;
