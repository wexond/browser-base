import styled from 'styled-components';
import { transparency } from 'nersent-ui';

export const StyledSuggestion = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
`;

export const Title = styled.div`
  position: absolute;
  left: 72px;
  opacity: ${transparency.light.text.primary};
`;

export const Icon = styled.div`
  position: absolute;
  left: 16px;
  width: 16px;
  height: 16px;
  background-color: #212121;
  opacity: 0.54;
`;
