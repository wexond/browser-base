import styled from 'styled-components';

import { robotoMedium, robotoLight } from '~/renderer/mixins';

export const Title = styled.div`
  font-size: 14px;
  ${robotoMedium()};
`;

export const Header = styled.div`
  margin-top: 4px;
  margin-bottom: 16px;
  font-size: 20px;
  ${robotoLight()};
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 48px;
`;

export const Control = styled.div`
  margin-left: auto;
`;

export const Sections = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  flex: 1;
  margin-left: 64px;
  margin-right: 64px;
  max-width: 1024px;
  margin-bottom: 32px;
`;

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
