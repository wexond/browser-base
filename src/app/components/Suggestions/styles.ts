import styled from 'styled-components';
import { shadows, transparency } from 'nersent-ui';
import Theme from '../../models/theme';

interface SuggestionsProps {
  theme?: Theme;
}

export const StyledSuggestions = styled.div`
  position: absolute;
  z-index: 50;
  background-color: white;
  width: 100%;
  box-shadow: ${shadows[3]};
  border-radius: 2px;
  margin-top: 14px;
  padding-bottom: 8px;
`;

export const Caption = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  margin-left: 16px;
  font-size: 12px;
  font-weight: 500;
  opacity: ${transparency.light.text.secondary};
`;
