import styled from 'styled-components';

export const StyledTopSites = styled.div`
  display: grid;
  grid-auto-flow: row;
  justify-content: center;
  grid-template-columns: repeat(8, auto);
  grid-gap: 6px;
  margin-top: 128px;
  margin-bottom: 128px;

  @media only screen and (max-width: 1200px) {
    grid-template-columns: repeat(4, auto);
  }
`;

export const ItemBase = styled.div`
  border-radius: 8px;
  width: 120px;
  height: 90px;
`;

export const Placeholder = styled(ItemBase)`
  box-sizing: border-box;
  border: 2px dashed rgba(255, 255, 255, 0.3);
`;
