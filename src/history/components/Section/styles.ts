import styled from 'styled-components';
import { typography } from 'nersent-ui';

export const Title = styled.div`
  font-size: 14px;
  ${typography.robotoMedium()};
  margin-left: 16px;
  opacity: 0.5;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  margin-top: 32px;
`;

export const Items = styled.div`
  display: flex;
  flex-flow: column;
  box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.1);
  background-color: white;
  overflow: hidden;
  border-radius: 10px;
`;
