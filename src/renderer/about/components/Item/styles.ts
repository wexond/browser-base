import styled from 'styled-components';

import { transparency } from '@/constants/renderer';
import { subtitle2, body2 } from '@/mixins';

export const StyledItem = styled.div`
  display: flex;
  font-size: 14px;
  height: 48px;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.div`
  margin-left: 16px;
  opacity: ${transparency.light.primaryText};

  ${subtitle2()};
`;

export const Content = styled.div`
  text-align: right;
  margin-right: 16px;
  opacity: ${transparency.light.secondaryText};

  ${body2()};
`;
