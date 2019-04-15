import styled, { css } from 'styled-components';
import { centerIcon, shadows } from '~/shared/mixins';

export const StyledTabGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 42px;
  color: white;
  border-radius: 50px;
  max-width: 200px;
  margin-right: 8px;
  margin-bottom: 8px;
  transition: 0.1s opacity;

  ${({ selected }: { selected: boolean }) => css`
    opacity: ${selected ? 1 : 0.6};
    box-shadow: ${selected ? shadows(6) : 'none'};

    &:hover {
      opacity: 1;
      cursor: ${selected ? 'default' : 'pointer'};
    }
  `}
`;

export const Content = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1;
`;

export const Icons = styled.div`
  display: flex;
  margin-left: 8px;
`;

export const Icon = styled.div`
  ${centerIcon()};
  width: 16px;
  height: 16px;
  margin-left: 4px;
  filter: invert(100%);
  opacity: 0.54;

  &:hover {
    opacity: 1;
  }
`;

export const Input = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  color: white;
  font-size: 14px;
  width: 100%;
`;
