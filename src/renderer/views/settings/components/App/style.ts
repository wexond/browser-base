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

export const MenuButton = styled.div`
  ${centerIcon(20)};
  width: 32px;
  height: 32px;
  background-image: url(${icons.menu});
  margin-left: 12px;
  margin-bottom: 16px;
  border-radius: 4px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;
