import styled from 'styled-components';

import { transparency } from '@/constants/renderer';
import { subtitle2 } from '@/mixins';

export const Title = styled.div`
  margin-bottom: 16px;
  margin-top: 32px;
  border-radius: 4px;
  display: table;
  padding: 8px;
  cursor: pointer;
  color: rgba(0, 0, 0, ${transparency.light.secondaryText});
  transition: 0.2s background-color;

  ${subtitle2()};

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const Items = styled.div`
  background-color: #fff;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08),
    0 1px 3px 1px rgba(60, 64, 67, 0.16);
`;
