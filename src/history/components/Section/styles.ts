import styled from 'styled-components';
import { typography } from 'nersent-ui';
import shadows from '../../../shared/mixins/shadows';

export const Title = styled.div`
  font-size: 20px;
  ${typography.robotoMedium()};
  margin-left: 24px;
  opacity: 0.87;
  letter-spacing: 0.0075rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
  margin-top: 32px;
`;

export const Items = styled.div`
  display: flex;
  flex-flow: column;
  box-shadow: ${shadows(1)};
  background-color: #fff;
  overflow: hidden;
  border-radius: 4px;
`;
