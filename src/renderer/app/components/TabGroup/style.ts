import styled, { css } from 'styled-components';
import { icons } from '../../constants';
import { centerImage } from '~/shared/mixins';

export const StyledTabGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 32px;
  color: white;
  border-radius: 50px;
  margin-right: 8px;
  transition: 0.1s opacity, 0.2s padding;

  ${({ selected }: { selected: boolean }) => css`
    opacity: ${selected ? 1 : 0.54};
    padding-right: ${selected ? '32px' : '12px'};

    &:hover {
      opacity: 1;
      padding-right: 32px;

      div${Close} {
        opacity: 1;
      }

      div${Content} {
        max-width: 100%;
      }
    }
  `}
`;

export const Content = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Close = styled.div`
  position: absolute;
  right: 8px;
  background-image: url(${icons.close});
  ${centerImage('16px', '16px')};
  width: 16px;
  height: 16px;
  filter: invert(100%);

  ${({ selected }: { selected: boolean }) => css`
    opacity: ${selected ? 1 : 0};
  `}
`;
