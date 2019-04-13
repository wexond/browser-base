import styled, { css } from 'styled-components';

import { centerImage } from '~/shared/mixins';
import { icons } from '../../constants';

export const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 48px;

  ${({ selected }: { selected: boolean }) => css`
    background-color: ${selected ? 'rgba(255, 255, 255, 0.12)' : 'transparent'};

    &:hover {
      background-color: rgba(255, 255, 255, ${selected ? 0.15 : 0.08});
    }
  `};
`;

export const Remove = styled.div`
  ${centerImage('16px', '16px')};
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
  ${centerImage('16px', '16px')};
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
