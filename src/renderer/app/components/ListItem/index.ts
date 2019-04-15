import styled, { css } from 'styled-components';

export const ListItem = styled.div`
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
