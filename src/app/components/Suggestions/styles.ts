import { shadows, transparency } from 'nersent-ui';
import styled from 'styled-components';

interface SuggestionsProps {
  visible: boolean;
}

export const StyledSuggestions = styled.div`
  position: absolute;
  z-index: 50;
  width: 100%;
  box-shadow: ${shadows[3]};
  border-radius: 2px;
  margin-top: 14px;
  padding-bottom: 8px;

  color: rgba(0, 0, 0, ${transparency.light.text.primary});
  background-color: #fafafa;
`;

export const Caption = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  margin-left: 16px;
  font-size: 12px;
  font-weight: 500;
  opacity: ${transparency.light.text.secondary};
`;
