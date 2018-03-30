import styled from 'styled-components';
import { transparency } from 'nersent-ui';

export const StyledSuggestion = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  transition: 0.2s background-color;

  &:hover {
    background-color: #eee;
  }
`;

export const PrimaryText = styled.div`
  margin-left: 64px;
  opacity: ${transparency.light.text.primary};
`;

export const SecondaryText = styled.div`
  opacity: ${transparency.light.text.secondary};
`;

export const Icon = styled.div`
  position: absolute;
  left: 16px;
  width: 16px;
  height: 16px;
  background-color: #212121;
  opacity: 0.54;
`;

export const Dash = styled.div`
  margin-left: 4px;
  margin-right: 4px;
  opacity: ${transparency.light.text.secondary};
`;
