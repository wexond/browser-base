import styled from 'styled-components';
import { typography } from 'nersent-ui';

export const StyledCard = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 32px;
`;

export const Title = styled.div`
  font-size: 16px;
  ${typography.robotoMedium()};
  margin-left: 16px;
  opacity: 0.87;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
`;

export const Items = styled.div`
  display: flex;
  flex-flow: column;
`;
