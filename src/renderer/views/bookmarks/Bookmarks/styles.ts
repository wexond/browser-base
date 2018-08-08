import styled from 'styled-components';

import { opacity } from '../../../../defaults';
import { subtitle2, noButtons } from '../../../mixins';

export const Content = styled.div`
  width: 100%;
  height: calc(100% - 56px);
  overflow-x: hidden;
  overflow-y: auto;

  ${noButtons('10px')};
`;

export const Container = styled.div`
  width: calc(100% - 64px);
  max-width: 640px;
  padding-top: 16px;
  padding-bottom: 32px;
  margin: 0 auto;
`;

export const Items = styled.div`
  margin-top: 16px;
  display: flex;
  flex-flow: column;
  overflow: hidden;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08), 0 1px 3px 1px rgba(60, 64, 67, 0.16);
`;

export const Caption = styled.div`
  margin-top: 32px;
  opacity: ${opacity.light.secondaryText};

  ${subtitle2()};
`;
