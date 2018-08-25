import styled from 'styled-components';

import { transparency } from '~/renderer/defaults';
import { PageContainer } from '../Menu/styles';
import { subtitle2 } from '@mixins';

export const Container = styled(PageContainer)`
  padding-top: 16px;
`;

export const Items = styled.div`
  margin-top: 16px;
  display: flex;
  flex-flow: column;
  overflow: hidden;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08),
    0 1px 3px 1px rgba(60, 64, 67, 0.16);
`;

export const Caption = styled.div`
  margin-top: 32px;
  opacity: ${transparency.light.secondaryText};

  ${subtitle2()};
`;
