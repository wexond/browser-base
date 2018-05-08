import styled from 'styled-components';
import { typography } from 'nersent-ui';

export const StyledItem = styled.div`
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const Icon = styled.div`
  height: 16px;
  width: 16px;
  margin-left: 48px;
  background-color: rgba(0, 0, 0, 0.54);
  border-radius: 4px;
`;

export const PrimaryText = styled.div`
  ${typography.robotoRegular()};
  font-size: 14px;
  opacity: 0.87;
`;

export const SecondaryText = styled.div`
  ${typography.robotoRegular()};
  font-size: 14px;
  opacity: 0.54;
`;

export const Title = styled(PrimaryText)`
  margin-left: 16px;
`;

export const Time = styled(SecondaryText)`
  margin-left: 16px;
`;
