import styled from 'styled-components';

import { transparency } from '@/constants/renderer';
import { caption } from '@/mixins';

export const StyledSuggestions = styled.div`
  z-index: 50;
  width: 100%;
  transition: 0.1s height;
  color: rgba(0, 0, 0, ${transparency.light.primaryText});
  border-top: 0px solid rgba(0, 0, 0, ${transparency.light.dividers});
`;

export const Caption = styled.div`
  height: 42px;
  display: flex;
  align-items: center;
  margin-left: 16px;
  opacity: ${transparency.light.secondaryText};
  ${caption()};
`;
