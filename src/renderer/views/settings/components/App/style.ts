import styled from 'styled-components';

import { robotoMedium, robotoLight, centerIcon } from '~/renderer/mixins';
import { icons } from '~/renderer/constants';

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
