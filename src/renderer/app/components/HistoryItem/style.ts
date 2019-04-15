import styled, { css } from 'styled-components';

import { centerIcon } from '~/shared/mixins';
import { icons } from '../../constants';

export const Remove = styled.div`
  ${centerIcon()};
  height: 16px;
  width: 16px;
  background-image: url(${icons.close});
  opacity: 0.54;
  filter: invert(100%);

  &:hover {
    opacity: 1;
  }
`;

export const Favicon = styled.div`
  ${centerIcon()};
  height: 16px;
  width: 16px;
  margin-right: 24px;
`;

export const Title = styled.div`
  flex: 3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 16px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const Site = styled.div`
  flex: 2;
  opacity: 0.54;
`;

export const Time = styled.div`
  flex: 1;
  opacity: 0.54;
`;
