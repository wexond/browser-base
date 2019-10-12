import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-image: url(https://i.ytimg.com/vi/lbnMmJQ7XpE/maxresdefault.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 300px;
  overflow: hidden;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    background-image: radial-gradient(
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.5) 100%
      ),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);
  }
`;

export const Content = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: calc(100% - 64px);
  margin: 0 auto;
  max-width: 1366px;
  position: relative;
  z-index: 3;
`;
