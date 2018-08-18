import styled, { css } from 'styled-components';

export default styled.div`
  ${({ selected }: { selected: boolean }) => css`
    flex: ${selected ? 1 : '0 1'};
    position: ${!selected ? 'absolute' : 'initial'};
    top: ${!selected ? 0 : 'auto'};
    left: ${!selected ? 0 : 'auto'};
    visibility: ${!selected ? 'hidden' : 'visible'};
  `};
`;
