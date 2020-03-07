import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';

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
  border-radius: 6px;
  width: 120px;
  height: 90px;
`;

export const Placeholder = styled(ItemBase)`
  box-sizing: border-box;

  ${({ theme, imageSet }: { theme?: ITheme; imageSet: boolean }) => css`
    border: 2px dashed
      ${!imageSet && !theme['pages.lightForeground']
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(255, 255, 255, 0.3)'};
  `}
`;
