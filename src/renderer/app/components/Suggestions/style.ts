import { transparency } from '~/renderer/constants';
import styled, { css } from 'styled-components';

export const StyledSuggestions = styled.div`
  width: 100%;
  color: rgba(0, 0, 0, ${transparency.text.high});
  overflow: hidden;

  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? 'block' : 'none'};
  `};
`;
