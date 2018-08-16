import styled from 'styled-components';
import { opacity } from '../../../../defaults';
import { caption } from '../../../mixins';

export const StyledSuggestions = styled.div`
  z-index: 50;
  width: 100%;
  transition: 0.1s height;
  color: rgba(0, 0, 0, ${opacity.light.primaryText});
  border-top: 0px solid rgba(0, 0, 0, ${opacity.light.dividers});
`;

export const Caption = styled.div`
  height: 42px;
  display: flex;
  align-items: center;
  margin-left: 16px;
  opacity: ${opacity.light.secondaryText};
  ${caption()};
`;
