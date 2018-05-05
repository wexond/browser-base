import { shadows, transparency } from 'nersent-ui';
import styled from 'styled-components';

interface SuggestionsProps {
  visible: boolean;
}

export const StyledSuggestions = styled.div`
  z-index: 50;
  width: 100%;
  padding-bottom: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);

  color: rgba(0, 0, 0, ${transparency.light.text.primary});
`;

export const Caption = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  margin-left: 16px;
  font-size: 12px;
  font-weight: 500;
  opacity: ${transparency.light.text.secondary};
`;
