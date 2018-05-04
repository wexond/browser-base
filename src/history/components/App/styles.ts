import styled from 'styled-components';
import { shadows, typography } from 'nersent-ui';

export const Card = styled.div`
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

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
`;

export const Item = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const ItemIcon = styled.div`
  height: 16px;
  width: 16px;
  margin-left: 48px;
  background-color: rgba(0, 0, 0, 0.54);
  border-radius: 4px;
`;

export const ItemPrimaryText = styled.div`
  ${typography.robotoRegular()};
  font-size: 14px;
  opacity: 0.87;
`;

export const ItemSecondaryText = styled.div`
  ${typography.robotoRegular()};
  font-size: 14px;
  opacity: 0.54;
`;

export const Content = styled.div`
  max-width: 960px;
  width: calc(100% - 64px);
  padding-top: 32px;
  padding-bottom: 32px;
  left: 50%;
  position: relative;
  transform: translateX(-50%);
`;
