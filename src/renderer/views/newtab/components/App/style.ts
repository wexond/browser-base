import styled, { css } from 'styled-components';
import { centerIcon } from '~/renderer/mixins';

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
    background-attachment: fixed;
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

export const Menu = styled.div`
  position: absolute;
  left: 0;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  margin-left: 16px;
`;

export const IconItem = styled.div`
  width: 40px;
  height: 40px;
  ${centerIcon(20)};
  margin-top: 8px;
  filter: invert(100%);
  opacity: 0.54;
  z-index: 3;
  cursor: pointer;
  border-radius: 4px;

  &:first-child {
    margin-top: 0;
  }

  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.06);
  }

  ${({ icon }: { icon?: string }) => css`
    background-image: url(${icon});
  `};
`;
